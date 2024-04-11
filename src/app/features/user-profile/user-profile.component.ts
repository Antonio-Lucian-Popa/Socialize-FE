import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EditDetailDialogComponent } from 'src/app/shared/edit-detail-dialog/edit-detail-dialog.component';
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


  user!: UserInformation;

  isMyProfile = false; // TODO: Set this to false if the user is not the logged in user

  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) { }

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
      console.log('The dialog was closed');
      this.user.bio = result.bio;
      this.user.interests = result.interests;
      this.user.livesIn = result.livesIn;
    });
  }

  isDetailsPresent(): boolean {
    return !!this.user.livesIn && !!this.user.bio && this.user.interests.length > 0;
  }

}
