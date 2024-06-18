import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user-profile-data';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-user-list-dialog',
  templateUrl: './user-list-dialog.component.html',
  styleUrls: ['./user-list-dialog.component.scss']
})
export class UserListDialogComponent implements OnInit {

  userList: User[] = [];
  isFollowing = true;
  userId!: string;

  isMyProfile: boolean = false;

  constructor(public dialogRef: MatDialogRef<UserListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private router: Router, private authService: AuthService) {
    this.isFollowing = data.isFollowing;
    this.userId = data.userId;
  }

  ngOnInit(): void {
    if (this.isFollowing) {
      this.userService.getFollowingUsers(this.userId).subscribe({
        next: (users) => {
          this.userList = users;
        },
        error: (error) => {
          console.error('Failed to fetch following users', error);
        }
      });
    } else {
      this.userService.getFollowers(this.userId).subscribe({
        next: (users) => {
          this.userList = users;
        },
        error: (error) => {
          console.error('Failed to fetch followers', error);
        }
      });
    }

    this.authService.getUserId().then(userId => {
      if (userId) {
        this.isMyProfile = userId === this.userId;
      }
    });
  }

  openUserProfile(userId: string): void {
    this.router.navigate(['/user-profile', userId]);
    this.closeDialog();
  }

  unfollowUser(userId: string): void {
    this.userService.unfollowUser(this.userId, userId).subscribe(() => {
      this.userList = this.userList.filter(user => user.id !== userId);
      this.userService.userRemoved.emit(userId);
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

}
