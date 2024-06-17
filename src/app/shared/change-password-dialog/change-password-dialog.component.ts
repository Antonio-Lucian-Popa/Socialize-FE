import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  changePasswordForm!: FormGroup;
  userId!: string;

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private userService: UserService) {
      this.changePasswordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
      });
      this.userId = data.userId;
     }

  ngOnInit(): void {
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('currentPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      this.userService.changePassword(this.userId, oldPassword, newPassword).subscribe({
        next: (res) => {
          alert('Password changed successfully');
        this.closeDialog();
      }, error: (err) => {
        alert(err.error.message);
      }});
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
