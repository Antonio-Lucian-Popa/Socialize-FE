import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../interfaces/user-profile-data';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-suggest',
  templateUrl: './user-suggest.component.html',
  styleUrls: ['./user-suggest.component.scss']
})
export class UserSuggestComponent implements OnInit {

  @Input() user!: User;
  isFollowed = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  openUserProfile(userId: string): void {
    if(userId) {
      this.router.navigate(['/user-profile', userId]);
    }
  }

  followUser(followingId: string): void {
    console.log('Follow user:', followingId);
    const followerId = this.userService.userInfo.id;
    if(followingId && followerId) {
      this.userService.followUser(followerId, followingId).subscribe((response) => {
        console.log('Follow user response:', response);
        this.isFollowed = true;
      });
    }
  }

  unfollowUser(unfollowingId: string): void {
    console.log('Unfollow user:', unfollowingId);
    const followerId = this.userService.userInfo.id;
    if(unfollowingId && followerId) {
      this.userService.unfollowUser(followerId, unfollowingId).subscribe((response) => {
        console.log('Unfollow user response:', response);
        this.isFollowed = false;
      });
    }
  }

}
