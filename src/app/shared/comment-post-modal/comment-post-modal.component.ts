import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../services/comment.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-comment-post-modal',
  templateUrl: './comment-post-modal.component.html',
  styleUrls: ['./comment-post-modal.component.scss']
})
export class CommentPostModalComponent implements OnInit {

  comments: any[] = [];

  commentForm = new FormGroup({
    commentText: new FormControl('')
  });


  post: any;
  userId: string;
  replyingTo: string | null = null; // parent comment id
  replyPrefix: string = '';

  constructor(public dialogRef: MatDialogRef<CommentPostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commentService: CommentService) {
    this.post = data.post;
    this.userId = data.userId;
    console.log(this.post)
  }

  ngOnInit(): void {
    // TODO: Fetch comments from API when user opens the modal using postId
    this.commentService.findCommentsByPostId(this.post.id).subscribe({
      next: (response) => {
        console.log('Comments fetched successfully', response);
        // Handle successful fetch action, e.g., update UI accordingly
        this.comments = response;
      },
      error: (error) => {
        console.error('Error fetching comments', error);
        // Handle error case
      },
    });

  }

  closeDialog(): void {
    // Close the dialog. Implement dialog close logic here, likely using MatDialogRef
    this.dialogRef.close();
  }

  prepareReply(comment: any): void {
    // Logic to set the form for replying, possibly including the commented user's name in the form's placeholder or value
    // Adjust based on your specific form handling logic
    this.replyPrefix = `Replying to ${comment.userDto.firstName}: `;
    // Reset the form control value with just the prefix to show to the user
    this.commentForm.get('commentText')!.setValue(this.replyPrefix);
    this.replyingTo = comment.id;
  }

  submitComment(): void {
    // Implement logic to handle comment submission.
    // Ensure to check whether it's a direct comment or a reply, and handle accordingly.
    if (this.replyingTo) {
      // Handle reply logic
      console.log(this.commentForm.get('commentText')!.value);
      this.createComment(this.replyingTo);
    } else {
      // Handle direct comment logic
      console.log(this.commentForm.get('commentText')!.value);
      this.createComment();
    }
    this.commentForm.reset();
    this.replyingTo = null; // Reset replying state
  }

  createComment(parentId?: string): void {
    let actualCommentText = this.commentForm.get('commentText')!.value!.replace(this.replyPrefix, '');
    this.commentService.createComment({
      parentId: parentId ? parentId : null,
      postId: this.post.id,
      userId: this.userId,
      value: actualCommentText ? actualCommentText : this.commentForm.get('commentText')!.value,
    }).subscribe({
      next: (response) => {
        console.log('Comment created successfully', response);
        // Handle successful comment creation, e.g., update UI accordingly
       // this.comments.push(response);
       if(!parentId) this.comments.push(response);
        this.insertSubComment(this.comments, parentId!, response);
      },
      error: (error) => {
        console.error('Error creating comment', error);
        // Handle error case
      },
    });
  }

  removeComment(commentId: string): void {
    // Define a recursive function to handle removal
    const removeCommentRecursive = (comments: any[], id: string): boolean => {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === id) {
                // If the target comment is found, remove it
                comments.splice(i, 1);
                return true; // Comment was successfully removed
            } else if (comments[i].subComments && comments[i].subComments.length > 0) {
                // If the comment has subComments, recurse into them
                const isRemoved = removeCommentRecursive(comments[i].subComments, id);
                console.log(isRemoved)
                if (isRemoved) {
                    // If the comment was removed in a nested subComments, no need to continue
                    return true;
                }
            }
        }
        return false; // Comment with the given ID was not found
    };

    // Start the recursive removal from the top-level comments
    removeCommentRecursive(this.comments, commentId);
}


  insertSubComment(comments: any[], parentId: string, subCommentToAdd: any): boolean {
    for (const comment of comments) {
      if (comment.id === parentId) {
        // Found the parent comment, insert the subComment
        comment.subComments.push(subCommentToAdd);
        return true; // Return true indicating the subComment has been added
      } else if (comment.subComments && comment.subComments.length > 0) {
        // Recursively search in subComments
        const isInserted = this.insertSubComment(comment.subComments, parentId, subCommentToAdd);
        if (isInserted) return true; // If inserted in a nested structure, stop searching
      }
    }
    return false; // Return false indicating the subComment has not been added
  }




}
