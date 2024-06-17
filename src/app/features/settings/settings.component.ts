import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChangePasswordDialogComponent } from 'src/app/shared/change-password-dialog/change-password-dialog.component';
import { UserInformation } from 'src/app/shared/interfaces/user-profile-data';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isGeneralSettings = true;
  isEditProfile = false;

  userId!: string;

  user!: UserInformation;

  userProfile = this.fb.group({
    firstName: [''],
    lastName: [''],
    biography: [''],
    email: [''],
    birthday: [''],
    interests: [''],
    livesIn: [''],
  });

  avatarUrl: string | ArrayBuffer | null = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  userProfileImage!: string;

  chipInput: string = '';
  chips: string[] = [];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if(userId) {
        this.userId = userId;
        this.loadUserProfile();
      }
    });
  }

  addChip(): void {
    const chipValue = this.userProfile.get('interests')?.value?.trim();
    if (chipValue && !this.chips.includes(chipValue)) {
      this.chips.push(chipValue);
      this.userProfile.get("interests")!.reset(); // Clear the input field
    }
    console.log(this.userProfile.value)
  }

  removeChip(chip: string): void {
    const chipIndex = this.chips.indexOf(chip);
    if (chipIndex >= 0) {
      this.chips.splice(chipIndex, 1);
    }
  }

  loadUserProfile(): void {
    this.userService.getUserProfileInfo(this.userId).subscribe((response) => {
      this.user = response;
      this.avatarUrl = this.user && this.user.profileImageUrl ? this.user.profileImageUrl : this.avatarUrl;
      this.userProfileImage =  this.user && this.user.profileImageUrl ? this.user.profileImageUrl : '';
      this.userProfile.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        biography: this.user.bio,
        email: this.user.email,
        birthday: this.user.birthday,
        livesIn: this.user.livesIn,
      });
      this.chips = this.user.interests;
    });
  }

  showGeneralSettings(): void {
    this.isGeneralSettings = true;
    this.isEditProfile = false;
  }

  showChangePassword(): void {
    // show change password form dialog
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px', // o la dimensione desiderata
      data: { userId: this.userId }
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
      const payload = {
        ...this.userProfile.value,
        bio: this.userProfile.value.biography,
        interests: this.chips
      }
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      // if (this.userAvatar) {
      //   formData.append('profileImage', this.userAvatar, this.userAvatar.name);
      // }
      // Call the UserService to handle the form submission
      if(this.avatarUrl && this.userProfileImage != undefined) {
        const blob = this.dataURLtoBlob(this.avatarUrl.toString());
        formData.append('file', blob, `file.${this.getFileExtension(blob.type)}`);
      }
      this.userService.updateProfile(this.userId, formData).subscribe((response) => {
        console.log('Profile updated successfully', response);
        if(response) {
          this.userService.userUpdatedInformation.emit(response);
        }
      });

      // TODO: check if the avatar is updated and if is the case emit an event to update the avatar in the header
    }
  }

  showEditProfile(): void {
    this.isEditProfile = true;
    this.isGeneralSettings = false;
  }

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }

  private getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      default:
        return 'dat';
    }
  }

}
