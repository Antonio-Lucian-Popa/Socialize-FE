import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User, UserProfileData } from '../interfaces/user-profile-data';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.scss']
})
export class PostInputComponent implements OnInit {

  @Output() postCreated = new EventEmitter<any>();

  user: any = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
  };

  userProfileImage!: string;

  constructor(public dialog: MatDialog, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchUserDetails();

    this.userService.userUpdatedInformation.subscribe((res: User) => {
      this.user = res;
      this.userProfileImage = res.profileImageUrl;
    });

    if ((this.user == undefined || this.user == null) || (this.userProfileImage == undefined || this.userProfileImage == null) && this.userService.userInfo) {
      this.user = this.userService.userInfo;
      this.userProfileImage = this.userService.userInfo.profileImageUrl;
    }
  }

  fetchUserDetails() {
    this.authService.getUserId().then(userId => {

      if (userId) {
        this.userService.getUserProfileInfo(userId).subscribe({
          next: (userProfile) => {
            this.user = userProfile;
            this.userProfileImage = userProfile.profileImageUrl;
          },
          error: (error) => {
            console.error('Error fetching user profile data:', error);
          }
        });
      }
    }).catch(error => {
      console.error('Error during user detail fetch operation:', error);
    });
  }

  openCreatePostModal(): void {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {
      width: '500px', // o la dimensione desiderata
      data: {
        profileImageUrl: this.user.profileImageUrl,
        user: this.user
      }
      // passa qui altri dati se necessario
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle the post creation result
      this.postCreated.emit(result);
    });
  }

}
