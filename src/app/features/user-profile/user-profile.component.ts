import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EditDetailDialogComponent } from 'src/app/shared/edit-detail-dialog/edit-detail-dialog.component';
import { UserInformation } from 'src/app/shared/interfaces/user-profile-data';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserListDialogComponent } from 'src/app/shared/user-list-dialog/user-list-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private routeSub!: Subscription;

  userId!: string | null;
  myUserId!: string | null;

  userProfileImage!: string;

  isUserFollowing = false;


  user!: UserInformation;

  isMyProfile = false; // TODO: Set this to false if the user is not the logged in user

  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog, private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');

      this.authService.getUserId().then((userId) => {
        this.myUserId = userId;
        if (this.userId) {
          this.loadUserInfo(this.userId);
        }
      });
    });

    this.postService.postDeleted.subscribe((postId: string) => {
      this.user.totalPosts--;
    });
  }

  loadUserInfo(userId: string): void {
    this.userService.getUserProfileInfo(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.isMyProfile = this.myUserId == data.id;
        this.user.followers.find((follower) => follower.id === this.myUserId) ? this.isUserFollowing = true : this.isUserFollowing = false;
      },
      error: (error) => {
        console.error('Error fetching user profile data:', error);
      }
    });
  }

  openDetailModal(): void {
    const dialogRef = this.dialog.open(EditDetailDialogComponent, {
      width: '500px', // o la dimensione desiderata
      data: {
        userId: this.userId,
        user: this.user
      }
      // passa qui altri dati se necessario
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.user.bio = result.bio;
      this.user.interests = result.interests;
      this.user.livesIn = result.livesIn;
    });
  }

  isDetailsPresent(): boolean {
    return !!this.user.livesIn && !!this.user.bio || this.user.interests.length > 0;
  }

  follow(): void {
    if(this.myUserId && this.userId) {
      this.userService.followUser(this.myUserId, this.userId).subscribe({
        next: (data) => {
          console.log('Followed user:', data);
          this.isUserFollowing = true;
          if(this.userId) this.loadUserInfo(this.userId);
        },
        error: (error) => {
          console.error('Error following user:', error);
          this.isUserFollowing = false;
        }
      });
    }
  }

  unfollow(): void {
    if(this.myUserId && this.userId) {
      this.userService.unfollowUser(this.myUserId, this.userId).subscribe({
        next: (data) => {
          console.log('Followed user:', data);
          this.isUserFollowing = false;
          if(this.userId) this.loadUserInfo(this.userId);
        },
        error: (error) => {
          console.error('Error following user:', error);
          this.isUserFollowing = true;
        }
      });
    }
  }

  checkPostCreated(event: any): void {
    console.log('Post created:', event);
    this.user.totalPosts++;
  }

  onBack(): void {
    window.history.back();
  }

  openFollowersDialog(): void {
    const dialogRef = this.dialog.open(UserListDialogComponent, {
      data: {
        isFollowing: false,
        userId: this.userId
      },
      width: '500px'
    });
  }

  openFollowingDialog(): void {
    const dialogRef = this.dialog.open(UserListDialogComponent, {
      data: {
        isFollowing: true,
        userId: this.userId
      },
      width: '500px'
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
