import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-detail-dialog',
  templateUrl: './edit-detail-dialog.component.html',
  styleUrls: ['./edit-detail-dialog.component.scss']
})
export class EditDetailDialogComponent implements OnInit {

  userDetails: any;
  userId!: string;

  editUserDetailsForm!: FormGroup;

  chipInput: string = '';
  chips: string[] = [];

  constructor(public dialogRef: MatDialogRef<EditDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private userService: UserService) {
      this.userDetails = data.user;
      this.userId = data.userId;
      this.editUserDetailsForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        birthday: [''],
        biography: [''],
        interests: [''],
        livesIn: [''],
      });
     }


  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfileInfo(this.userId).subscribe((response) => {
      this.editUserDetailsForm.patchValue({
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        birthday: response.birthday,
        biography: response.bio,
        livesIn: response.livesIn,
      });
      this.chips = response.interests;
    });
  }

  addChip(): void {
    const chipValue = this.editUserDetailsForm.get('interests')?.value?.trim();
    if (chipValue && !this.chips.includes(chipValue)) {
      this.chips.push(chipValue);
      this.editUserDetailsForm.get("interests")!.reset(); // Clear the input field
    }
    console.log(this.editUserDetailsForm.value)
  }

  removeChip(chip: string): void {
    const chipIndex = this.chips.indexOf(chip);
    if (chipIndex >= 0) {
      this.chips.splice(chipIndex, 1);
    }
  }

  onEdit() {
    if (this.editUserDetailsForm.valid) {
      const payload = {
        ...this.editUserDetailsForm.value,
        bio: this.editUserDetailsForm.value.biography,
        interests: this.chips
      }
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

      this.userService.updateProfile(this.userId, formData).subscribe((response) => {
        console.log('Profile updated successfully', response);
        if(response) {
         // this.userService.userUpdatedInformation.emit(response);
          this.closeDialog(response);
        }
      });

    }
  }

  closeDialog(data?: any): void {
    this.dialogRef.close(data);
  }
}
