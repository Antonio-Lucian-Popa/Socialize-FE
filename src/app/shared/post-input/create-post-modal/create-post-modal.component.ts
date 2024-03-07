import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent implements OnInit {

  postForm: FormGroup;

  images: string[] = []; // URLs for the preview images
  user = {
    firstName: 'Jane', // Example user data
    lastName: 'Doe',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' // Replace with actual path
  };

  constructor(private fb: FormBuilder) {
    // Inizializza il form group con un controllo per il contenuto del post
    this.postForm = this.fb.group({
      postContent: ''
    });
  }

  ngOnInit(): void {
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  submitPost(): void {
    // Handle post submission...
    console.log(this.postForm.value.postContent, this.images);
    this.postForm.reset();
    this.images = [];
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
