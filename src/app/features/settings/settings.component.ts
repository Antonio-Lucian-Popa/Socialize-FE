import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from 'src/app/shared/change-password-dialog/change-password-dialog.component';
import { UserService } from 'src/app/shared/services/user.service';

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

  avatarUrl: string | ArrayBuffer | null = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  constructor(public dialog: MatDialog, private fb: FormBuilder, private userService: UserService) { }

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

  onAvatarChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.readAvatar(file);
    }
  }

  readAvatar(file: File) {
    const reader = new FileReader();
    reader.onload = e => this.avatarUrl = e.target!.result;
    reader.readAsDataURL(file);
  }

  onEditProfile() {
    if (this.userProfile.valid) {
      const formData = new FormData();
      formData.append('userProfile', new Blob([JSON.stringify(this.userProfile.value)], { type: 'application/json' }));
      // if (this.userAvatar) {
      //   formData.append('profileImage', this.userAvatar, this.userAvatar.name);
      // }
      // Call the UserService to handle the form submission
      this.userService.updateProfile(formData);

      // TODO: check if the avatar is updated and if is the case emit an event to update the avatar in the header
    }
  }

  showEditProfile(): void {
    this.isEditProfile = true;
    this.isGeneralSettings = false;
  }

}
