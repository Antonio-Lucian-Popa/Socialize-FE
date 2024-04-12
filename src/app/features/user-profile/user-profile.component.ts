import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { EditDetailDialogComponent } from 'src/app/shared/edit-detail-dialog/edit-detail-dialog.component';
import { UserInformation } from 'src/app/shared/interfaces/user-profile-data';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private routeSub!: Subscription;

  userId!: string | null;

  userProfileImage!: string;


  user!: UserInformation;

  isMyProfile = false; // TODO: Set this to false if the user is not the logged in user

  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.loadUserInfo(this.userId);
      }
    });
  }

  loadUserInfo(userId: string): void {
    this.userService.getUserProfileInfo(userId).subscribe({
      next: (data) => {
        this.user = data;
        console.log(this.userService.userInfo.id, data.id);
        this.isMyProfile = this.userService.userInfo.id == data.id;
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
    return !!this.user.livesIn && !!this.user.bio && this.user.interests.length > 0;
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
