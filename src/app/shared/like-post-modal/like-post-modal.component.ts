import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-like-post-modal',
  templateUrl: './like-post-modal.component.html',
  styleUrls: ['./like-post-modal.component.scss']
})
export class LikePostModalComponent implements OnInit {

  likes: any[] = [];
  userId!: string;

  displayedLikes: any[] = [];
  private batchSize: number = 10;

  constructor(
    public dialogRef: MatDialogRef<LikePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
    ) {
      this.likes = data.likes;
      this.displayedLikes = data.likes;
      this.userId = data.userId;
    }

  ngOnInit(): void {
    // TODO: Fetch likes from API when user opens the modal
   // this.loadMoreLikes();
   const userIds = this.likes.map(like => like.id);
   this.userService.checkUsersFollowing(this.userId, userIds).subscribe((res: string[]) => {
    this.likes = this.likes.map(like => ({
      ...like,
      isFollowing: res.includes(like.id) ? true : false
    }));
    this.displayedLikes = this.likes;
   });
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

    if(user.isFollowing) {
      this.userService.unfollowUser(this.userId, user.id).subscribe((response) => {
        this.userService.userAddedOrRemovedOnFollowList.emit(user.id);
      });
    } else {
      this.userService.followUser(this.userId, user.id).subscribe((response) => {
        this.userService.userAddedOrRemovedOnFollowList.emit(response);
      });

    }

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
