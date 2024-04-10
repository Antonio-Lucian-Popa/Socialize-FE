import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, of, switchMap } from 'rxjs';
import { User, UserProfileData } from 'src/app/shared/interfaces/user-profile-data';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss']
})
export class EditPostModalComponent implements OnInit {

  postForm: FormGroup;

  postId!: string;

  images: { data: string | File; type: 'existing' | 'new' }[] = [];
  imagesToRemove: string[] = []; // Track URLs of existing images to remove

  user!: User;
  userProfileImage!: string;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialogRef: MatDialogRef<EditPostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {
    this.user = data.user;
    console.log('Data:', data)
    this.userProfileImage = data.profileImageUrl;
    this.postId = data.post.id;

    this.data.post.imageFilenames.forEach((url: string) => {
      this.images.push({ data: url, type: 'existing' });
    });

    this.postForm = this.fb.group({
      description: data.post.description,
    });
  }

  ngOnInit(): void {
    this.userService.userUpdatedInformation.subscribe((res: UserProfileData) => {
      this.user = res.userInfo;
      this.userProfileImage = res.userProfileImage;
    });
  }


  removeImage(index: number): void {
    const imageToRemove = this.images[index];

    if (imageToRemove.type === 'existing') {
      // Assume `data` holds the URL for existing images
      this.imagesToRemove.push(imageToRemove.data as string);
      // Optionally, remove the image from the `images` array for immediate UI update,
      this.images.splice(index, 1);
    } else {
      // Direct removal from the array if it's a new image
      this.images.splice(index, 1);
    }
  }

  onImageUpload(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        // Assuming you use Data URLs for preview
        const reader = new FileReader();
        reader.onload = (e: any) => this.images.push({ data: e.target.result, type: 'new' });
        reader.readAsDataURL(file);
      });
    }
  }

  submitEditForm(): void {
    const updatedPost = {
      description: this.postForm.get('description')?.value,
      // Include other fields as needed
    };

    const newImages = this.images.filter((image) => image.type === 'new').map((image) => image.data as string);

    // Start by updating the post details and uploading new images if any
    this.postService.editPostById(this.data.post.id, this.user.id, updatedPost, newImages)
      .pipe(
        // Chain the removal operation only if there are images to remove
        switchMap((updateResponse) => {
          if (this.imagesToRemove.length > 0) {
            return this.postService.removeImagesFromPost(this.data.post.id, this.imagesToRemove)
              .pipe(
                // Optionally handle the removal response
                switchMap((removeResponse) => {
                  // If you need to perform actions after successful removal, do them here
                  // For example, logging or further data manipulation
                  return of(this.imagesToRemove); // Return the removal operation's observable
                }),
                catchError((error) => {
                  // Handle errors from the removal operation
                  console.error('Failed to remove images', error);
                  return of(null); // Ensure the observable chain continues even in case of error
                })
              );
          }
          // If no images to remove, skip to the end with the update response
          return of(updateResponse);
        }),
        catchError((error) => {
          // Handle errors from the update operation
          console.error('Error updating post:', error);
          return of(null); // Ensure the observable chain continues even in case of error
        })
      )
      .subscribe({
        next: (response) => {
          // Finalize the operation, handling both update and optional remove success
          console.log('Post updated successfully:', response);
          this.dialogRef.close(response); // Close the dialog on successful update and/or removal
        },
        error: (error) => {
          // Log or handle any errors not caught by the catchError operators
          console.error('An error occurred:', error);
        }
      });
  }


}
