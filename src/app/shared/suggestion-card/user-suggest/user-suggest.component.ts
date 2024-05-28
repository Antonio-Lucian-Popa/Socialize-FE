import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../interfaces/user-profile-data';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-user-suggest',
  templateUrl: './user-suggest.component.html',
  styleUrls: ['./user-suggest.component.scss']
})
export class UserSuggestComponent implements OnInit {

  @Input() user!: User;
  isFollowed = false;

  myUserId!: string;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  openUserProfile(userId: string): void {
    if(userId) {
      this.router.navigate(['/user-profile', userId]);
    }
  }

  followUser(followingId: string): void {
    this.authService.getUserId().then((userId) => {
      if (userId) {
        this.myUserId = userId;

        if(followingId) {
          this.userService.followUser(this.myUserId, followingId).subscribe((response) => {
            this.isFollowed = true;
          });
        }
      }
    });
  }

  unfollowUser(unfollowingId: string): void {
    const followerId = this.userService.userInfo.id;
    if(unfollowingId && followerId) {
      this.userService.unfollowUser(followerId, unfollowingId).subscribe((response) => {
        this.isFollowed = false;
      });
    }
  }

}
