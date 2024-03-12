import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from 'src/app/shared/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isGeneralSettings = true;

  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    password: '123456',
  };

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showGeneralSettings(): void {
    this.isGeneralSettings = true;
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

}
