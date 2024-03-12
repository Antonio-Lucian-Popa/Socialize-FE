import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  changePasswordForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
      this.changePasswordForm = this.fb.group({
        currentPassword: [''],
        newPassword: [''],
      });
     }

  ngOnInit(): void {
  }

  onChangePassword(): void {
    // change password
    console.log(this.changePasswordForm.value);
    // TODO: call API to change password
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
