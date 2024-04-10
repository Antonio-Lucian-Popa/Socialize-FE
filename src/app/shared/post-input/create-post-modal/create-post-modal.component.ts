import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User, UserProfileData } from '../../interfaces/user-profile-data';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent implements OnInit {

  postForm: FormGroup;

  images: string[] = []; // URLs for the preview images

  user!: User;
  userProfileImage!: string;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialogRef: MatDialogRef<CreatePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
    ) {
    // Inizializza il form group con un controllo per il contenuto del post
    this.user = data.user;
    this.userProfileImage = data.profileImageUrl;
    this.postForm = this.fb.group({
      description: ''
    });
  }

  ngOnInit(): void {

    this.userService.userUpdatedInformation.subscribe((res: UserProfileData) => {
      this.user = res.userInfo;
    });

  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  createPost(): void {
    // Handle post creation...
    if (this.user.id && this.user.id !== '') {
      this.postService.postCreated.emit({
        userId: this.user.id,
        createPostDto: this.postForm.value,
        images: this.images
      });
      this.dialogRef.close();
      this.postForm.reset();
      this.images = [];
    }
  }

  onImageUpload(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;

    if (files) {
      // Convert FileList to array and iterate
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

}
