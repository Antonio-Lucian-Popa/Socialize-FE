import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from 'src/app/shared/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isGeneralSettings = true;
  isEditProfile = false;

  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    password: '123456',
    biography: 'Love to learn new things.'
  };

  userProfile = this.fb.group({
    firstName: [this.user.firstName],
    lastName: [this.user.lastName],
    biography: [this.user.biography],
    email: [this.user.email],
  });

  constructor(public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  showGeneralSettings(): void {
    this.isGeneralSettings = true;
    this.isEditProfile = false;
  }

  showChangePassword(): void {
    // show change password form dialog
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px', // o la dimensione desiderata
      // passa qui altri dati se necessario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // gestisci qui il risultato se necessario
    });

  }

  onEditProfile(): void {
    // TODO: call API to update user profile
    console.log(this.userProfile.value);
  }

  showEditProfile(): void {
    this.isEditProfile = true;
    this.isGeneralSettings = false;
  }

}
