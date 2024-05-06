import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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

  changeView(profileImage: boolean, profileInfo: boolean, followers: boolean) {
    this.isAddProfileImage = profileImage;
    this.isAddProfileInfo = profileInfo;
    this.isAddFollowers = followers;
  }

  skipView(): void {
    if(this.isAddProfileImage) {
      // set default image profile

    }
  }

}
