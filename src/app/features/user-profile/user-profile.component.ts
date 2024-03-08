import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userId!: string | null;

  user = {
    firstName: 'Jake',
    lastName: 'Smith',
    username: 'wellsalex',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    followers: '4.6k',
    following: '4.6k',
    posts: '4.6k',
    location: 'Mountain View, CA',
    bio: 'Lover of the outdoors and all things mountain.',
    interests: ['Hiking', 'Skiing', 'Photography']
  };

  isMyProfile = true; // TODO: Set this to false if the user is not the logged in user

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if(this.userId) {
      console.log(`User Profile for user with ID: ${this.userId}`);
      // TODO: Fetch user profile data
    }
  }

}
