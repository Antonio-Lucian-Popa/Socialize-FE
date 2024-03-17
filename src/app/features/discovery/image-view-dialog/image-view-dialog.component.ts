import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-view-dialog',
  templateUrl: './image-view-dialog.component.html',
  styleUrls: ['./image-view-dialog.component.scss']
})
export class ImageViewDialogComponent implements OnInit {

  popularImagePost = {
    id: 1,
    user: {
      id: 45,
      firstName: 'John',
      lastName: 'Doe',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    image: 'https://plus.unsplash.com/premium_photo-1710119487367-8489287f04a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'This is a great image!',
    date: '2021-04-15T19:00:00.000Z'
  };

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

  isPostLiked: boolean = false;

  replyingTo: number | null = null;

  constructor(public dialogRef: MatDialogRef<ImageViewDialogComponent>) { }

  ngOnInit(): void {
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

  toggleLikePost(post: any): void {
    this.isPostLiked = !this.isPostLiked;
    // TODO: Send a request to like/unlike the post
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
