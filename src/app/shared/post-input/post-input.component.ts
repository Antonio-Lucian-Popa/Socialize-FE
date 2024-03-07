import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.scss']
})
export class PostInputComponent implements OnInit {

  postForm = new FormGroup({
    postContent: new FormControl('')
  });

  user: any = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // TODO: Fetch the user from the backend
  }

  openCreatePostModal(): void {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {
      width: '500px', // o la dimensione desiderata
      // passa qui altri dati se necessario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // gestisci qui il risultato se necessario
    });
  }

  submitPost(): void {
    const post = this.postForm.value.postContent;
    // Here you'd handle the post submission, e.g., sending it to a backend server
    console.log(post);

    // Reset the form after submission
    this.postForm.reset();
  }

}
