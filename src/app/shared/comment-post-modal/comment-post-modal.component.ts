import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../services/comment.service';

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
  replyingTo: number | null = null;

  constructor(public dialogRef: MatDialogRef<CommentPostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commentService: CommentService) {
      this.post = data.post;
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
    this.commentForm.get('commentText')!.setValue(`Replying to ${comment.user.firstName}: `);
  }

  submitComment(): void {
    // Implement logic to handle comment submission.
    // Ensure to check whether it's a direct comment or a reply, and handle accordingly.
    if (this.replyingTo) {
      // Handle reply logic
    } else {
      // Handle direct comment logic
    }
    this.commentForm.reset();
    this.replyingTo = null; // Reset replying state
  }




}
