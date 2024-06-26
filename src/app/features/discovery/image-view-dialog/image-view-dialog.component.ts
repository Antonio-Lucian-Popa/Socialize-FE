import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PostDto } from 'src/app/shared/interfaces/post-dto';
import { CommentService } from 'src/app/shared/services/comment.service';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-image-view-dialog',
  templateUrl: './image-view-dialog.component.html',
  styleUrls: ['./image-view-dialog.component.scss']
})
export class ImageViewDialogComponent implements OnInit {

  postId: string;

  popularImagePost!: PostDto;
  userId: string;

  comments: any[] = [
    {
      id: 1,
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      value: 'This is a great post!',
      date: '2021-04-15T19:00:00.000Z',
      subcomments: [
        {
          id: 3,
          user: {
            id: 45,
            firstName: 'John',
            lastName: 'Doe',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          },
          value: 'Thanks!',
          date: '2021-04-15T19:00:00.000Z',
          subcomments: [
            {
              id: 4,
              user: {
                id: 45,
                firstName: 'John',
                lastName: 'Doe',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              },
              value: 'You\'re welcome!',
              date: '2021-04-15T19:00:00.000Z',
              subcomments: [
                {
                  id: 5,
                  user: {
                    id: 45,
                    firstName: 'John',
                    lastName: 'Doe',
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  },
                  value: 'Anytime!',
                  date: '2021-04-15T19:00:00.000Z',
                  subcomments: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      user: {
        id: 46,
        firstName: 'Jane',
        lastName: 'Doe',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      value: 'I agree!',
      date: '2021-04-15T19:00:00.000Z'
    }
  ];

  commentForm = new FormGroup({
    commentText: new FormControl('')
  });

  isChangesSaved: boolean = false;

  isPostLiked: boolean = false;

  replyingTo: string | null = null; // parent comment id
  replyPrefix: string = '';

  constructor(
    public dialogRef: MatDialogRef<ImageViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postService: PostService,
    private commentService: CommentService,
    private router: Router
  ) {
    this.postId = data.postId;
    this.userId = data.userId;
  }

  ngOnInit(): void {
    if (this.postId) {
      this.loadData();
    }
  }

  loadData(): void {
    forkJoin({
      post: this.postService.getPostById(this.postId),
      comments: this.commentService.findCommentsByPostId(this.postId)
    }).subscribe({
      next: (results) => {
        this.popularImagePost = results.post;
        this.isPostLiked = this.popularImagePost.likes.some((like) => like.id === this.userId);
        this.comments = results.comments;
      },
      error: (error) => {
        console.error('Failed to fetch data', error);
      }
    });
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
      this.createComment(this.replyingTo);
    } else {
      this.createComment();
    }
    this.commentForm.reset();
    this.replyingTo = null; // Reset replying state
  }

  createComment(parentId?: string): void {
    let actualCommentText = this.commentForm.get('commentText')!.value!.replace(this.replyPrefix, '');
    this.commentService.createComment({
      parentId: parentId ? parentId : null,
      postId: this.popularImagePost.id,
      userId: this.userId,
      value: actualCommentText ? actualCommentText : this.commentForm.get('commentText')!.value,
    }).subscribe({
      next: (response) => {
        // Handle successful comment creation, e.g., update UI accordingly
        // this.comments.push(response);
        response.subComments = []; // Initialize subComments for new comments
        if (!parentId) {
          this.comments.push(response);
        } else {
          this.insertSubComment(this.comments, parentId, response);
        }
        this.isChangesSaved = true;
      },
      error: (error) => {
        // Handle error case
        this.isChangesSaved = false;
      },
    });
  }

  insertSubComment(comments: any[], parentId: string, subCommentToAdd: any): boolean {
    for (const comment of comments) {
      if (comment.id === parentId) {
        if (!comment.subComments) {
          comment.subComments = []; // Ensure subComments is an array
        }
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

  removeComment(commentId: string): void {
    // Define a recursive function to handle removal
    const removeCommentRecursive = (comments: any[], id: string): boolean => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === id) {
          // If the target comment is found, remove it
          comments.splice(i, 1);
          this.isChangesSaved = true;
          return true; // Comment was successfully removed
        } else if (comments[i].subComments && comments[i].subComments.length > 0) {
          // If the comment has subComments, recurse into them
          const isRemoved = removeCommentRecursive(comments[i].subComments, id);
          if (isRemoved) {
            // If the comment was removed in a nested subComments, no need to continue
            this.isChangesSaved = true;
            return true;
          }
        }
      }
      return false; // Comment with the given ID was not found
    };

    // Start the recursive removal from the top-level comments
    removeCommentRecursive(this.comments, commentId);

  }

  toggleLikePost(): void {
    this.isPostLiked = !this.isPostLiked;
    // TODO: Send a request to like/unlike the post
    if (this.isPostLiked) {
      this.likePost(this.popularImagePost.id);
    } else {
      this.unlikePost(this.popularImagePost.id);
    }
  }

  likePost(postId: string) {
    this.postService.likePost(postId, this.userId).subscribe({
      next: (response) => {
        // Handle successful like action, e.g., update UI accordingly
        this.popularImagePost.likes = response.likes;
        this.postService.postLiked.emit(response);
      },
      error: (error) => {
        console.error('Error liking the post', error);
        // Handle error case
      },
    });
  }

  unlikePost(postId: string) {
    this.postService.unlikePost(postId, this.userId).subscribe({
      next: (response) => {
        // Handle successful like action, e.g., update UI accordingly
        this.popularImagePost.likes = response.likes;
        this.postService.postLiked.emit(response);
      },
      error: (error) => {
        console.error('Error liking the post', error);
        // Handle error case
      },
    });
  }

  openUserProfile(userId: string): void {
    this.router.navigate(['/user-profile', userId]);
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close(this.isChangesSaved);
    this.isChangesSaved = false;
  }
}
