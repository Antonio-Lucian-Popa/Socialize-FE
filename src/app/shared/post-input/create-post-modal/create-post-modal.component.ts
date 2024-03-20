import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent implements OnInit {

  postForm: FormGroup;

  userId = '';

  images: string[] = []; // URLs for the preview images
  user = {
    firstName: 'Jane', // Example user data
    lastName: 'Doe',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' // Replace with actual path
  };

  constructor(private fb: FormBuilder, private postService: PostService, private auth: AuthService, private dialogRef: MatDialogRef<CreatePostModalComponent>) {
    // Inizializza il form group con un controllo per il contenuto del post
    this.postForm = this.fb.group({
      description: ''
    });
  }

  ngOnInit(): void {
    this.auth.getUserId().then((userId) => {
      console.log(userId);
      if(userId) {
        this.userId = userId;
      }
    });
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  createPost(): void {
    // Handle post creation...
    if (this.userId && this.userId !== '') {
      this.postService.postCreated.emit({
        userId: this.userId,
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
