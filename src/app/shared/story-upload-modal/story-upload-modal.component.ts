import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User, UserProfileData } from '../interfaces/user-profile-data';
import { StoryService } from '../services/story.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-story-upload-modal',
  templateUrl: './story-upload-modal.component.html',
  styleUrls: ['./story-upload-modal.component.scss']
})
export class StoryUploadModalComponent implements OnInit {

//catch error con alert in caso di errore, piu lo spinner di tutto piu coverage
  image: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private dialogRef: MatDialogRef<StoryUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    // Inizializza il form group con un controllo per il contenuto del post
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.image = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onUpload() {
    if (this.image) {
      this.dialogRef.close(this.image);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }


}
