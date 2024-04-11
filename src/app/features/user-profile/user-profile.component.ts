import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserInformation } from 'src/app/shared/interfaces/user-profile-data';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userId!: string | null;

  userProfileImage!: string;

  // user: UserProfileData = {
  //   firstName: 'Jake',
  //   lastName: 'Smith',
  //   username: 'wellsalex',
  //   image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //   followers: '4.6k',
  //   following: '4.6k',
  //   posts: '4.6k',
  //   location: 'Mountain View, CA',
  //   bio: 'Lover of the outdoors and all things mountain.',
  //   interests: ['Hiking', 'Skiing', 'Photography']
  // };

  user!: UserInformation;

  isMyProfile = false; // TODO: Set this to false if the user is not the logged in user

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if(this.userId) {
      // TODO: Fetch user profile data
      this.userService.getUserProfileInfo(this.userId).subscribe({
        next: (data) => {
          console.log('Fetched User Profile Data:', data);
          this.user = data;
          console.log(this.userService.userInfo.id, data.id);
          this.isMyProfile = this.userService.userInfo.id == this.user.id;
        },
        error: (error) => {
          console.error('Error fetching user profile data:', error);
        }
      });
    }
  }

}
