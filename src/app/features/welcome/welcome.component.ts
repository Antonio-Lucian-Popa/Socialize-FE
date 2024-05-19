import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  userId!: string;

  userProfile = this.fb.group({
    firstName: [''],
    lastName: [''],
    biography: [''],
    email: [''],
    birthday: [''],
    interests: [''],
    livesIn: [''],
  });

  avatarUrl: string | ArrayBuffer | null = "./assets/profile-image.png";
  userProfileImage: string = "./assets/profile-image.png";

  chipInput: string = '';
  chips: string[] = [];

  isAddProfileImage = true;
  isAddProfileInfo = false;
  isAddFollowers = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if (userId) {
        this.userId = userId;
        this.loadUserProfile();
      }
    });
  }

  loadUserProfile(): void {
    this.userService.getUserProfileInfo(this.userId).subscribe((response) => {
      this.userProfile.patchValue({
        firstName: response.firstName,
        lastName: response.lastName,
        biography: response.bio,
        email: response.email,
        birthday: response.birthday,
        livesIn: response.livesIn,
      });
      this.chips = response.interests;
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
    reader.onload = e => {
      this.avatarUrl = e.target!.result
      this.userProfileImage = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  }

  addChip(): void {
    const chipValue = this.userProfile.get('interests')?.value?.trim();
    if (chipValue && !this.chips.includes(chipValue)) {
      this.chips.push(chipValue);
      this.userProfile.get("interests")!.reset(); // Clear the input field
    }
  }

  removeChip(chip: string): void {
    const chipIndex = this.chips.indexOf(chip);
    if (chipIndex >= 0) {
      this.chips.splice(chipIndex, 1);
    }
  }

  changeView(profileImage: boolean, profileInfo: boolean, followers: boolean) {
    this.isAddProfileImage = profileImage;
    this.isAddProfileInfo = profileInfo;
    this.isAddFollowers = followers;
  }


  goToHome(): void {
    // navigate to home page
    this.router.navigate(['/home']);
  }

  submitProfile(): void {
    // submit the user profile
    this.onEditProfile();
    this.goToHome();
  }

  onEditProfile() {
    const payload = {
      ...this.userProfile.value,
      bio: this.userProfile.value.biography,
      interests: this.chips,
      isUserNew: true
    }
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (this.avatarUrl && this.userProfileImage != undefined && !this.userProfileImage.startsWith('./assets/')) {
      const blob = this.dataURLtoBlob(this.avatarUrl.toString());
      formData.append('file', blob, `file.${this.getFileExtension(blob.type)}`);
    } else {
      const emptyFileBlob = new Blob([], { type: 'application/octet-stream' });
      formData.append('file', emptyFileBlob, 'emptyfile.dat');
    }
    this.userService.updateProfile(this.userId, formData).subscribe((response) => {
      if (response) {
        this.userService.userUpdatedInformation.emit(response);
      }
    });
  }

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
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
