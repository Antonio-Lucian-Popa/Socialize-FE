import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-like-post-modal',
  templateUrl: './like-post-modal.component.html',
  styleUrls: ['./like-post-modal.component.scss']
})
export class LikePostModalComponent implements OnInit {

  likes: any[] = [
    {
      id: 1,
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    },
    {
      id: 2,
      user: {
        id: 46,
        firstName: 'Jane',
        lastName: 'Doe',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    }
  ];

  displayedLikes: any[] = [];
  private batchSize: number = 10;

  constructor(
    public dialogRef: MatDialogRef<LikePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    // TODO: Fetch likes from API when user opens the modal
    this.loadMoreLikes();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  loadMoreLikes(): void {
    const currentLength = this.displayedLikes.length;
    const moreLikes = this.likes.slice(currentLength, currentLength + this.batchSize);
    this.displayedLikes = [...this.displayedLikes, ...moreLikes];
  }

  toggleFollow(user: any): void {
    // Placeholder for follow/unfollow logic
    // This might involve updating the user object and possibly making an API call
    user.isFollowing = !user.isFollowing;
  }

  /**
   *
   * @param user the current user
   * @returns true or false if this user is following the user in the argument
   */
  checkIfFollowingUser(user: any): boolean {
    // Placeholder for checking if the current user is following the user in the argument
    // TODO: made a BE request to check if the user is following the user in the argument
    return user.isFollowing;
  }

}
