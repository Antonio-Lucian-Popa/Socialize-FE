import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserProfileData } from '../interfaces/user-profile-data';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.scss']
})
export class PostInputComponent implements OnInit {

  user: any = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
  };

  userProfileImage!: string;

  constructor(public dialog: MatDialog, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    // TODO: Fetch the user from the backend
    //   this.fetchUserDetails();

    ///
    this.userService.userUpdatedInformation.subscribe((res: UserProfileData) => {
      this.user = res.userInfo;
      this.userProfileImage = res.userProfileImage;
    });
  }

  // fetchUserDetails() {
  //   this.authService.getUserId().then(userId => {
  //     if (!userId) {
  //       console.log('No valid user ID available');
  //       return;
  //     }

  //     this.userService.fetchUserProfile(userId).subscribe({
  //       next: (data) => {
  //         this.user = data.userInfo;
  //         this.userProfileImage = data.userProfileImage;
  //         console.log('Fetched User Profile Data:', data);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching user profile data:', error);
  //       }
  //     });
  //   }).catch(error => {
  //     console.error('Error during user detail fetch operation:', error);
  //   });
  // }

  openCreatePostModal(): void {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {
      width: '500px', // o la dimensione desiderata
      // passa qui altri dati se necessario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        // TODO: show loading bar and after show the post in the first position of the feed
      }
      // gestisci qui il risultato se necessario
    });
  }

}
