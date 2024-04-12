import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewDialogComponent } from './image-view-dialog/image-view-dialog.component';
import { PostService } from 'src/app/shared/services/post.service';
import { PostImage } from 'src/app/shared/interfaces/post-image';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.scss']
})
export class DiscoveryComponent implements OnInit {

  popularImages: PostImage[] = [];

  loading: boolean = true;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  myUserId!: string;


  constructor(public dialog: MatDialog, private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if (userId) {
        this.myUserId = userId;
      }
    });
    this.loadImages();
  }

  loadImages(): void {
    if (this.totalPages !== undefined && this.totalPages > 0 && this.currentPage >= this.totalPages) {
      return;
    }
    this.loading = true;
    this.postService.getPopularImages(this.currentPage, this.pageSize).subscribe({
      next: (pageData) => {
        this.popularImages = pageData.content;
        this.totalPages = pageData.totalPages;
        this.loading = false; // Reset loading state
      },
      error: (error) => {
        console.error('Failed to fetch images', error);
        this.loading = false; // Ensure loading is reset on error
      }
    });
  }

  // Call this method to load more images
  loadMore(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadImages();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadImages();
    }
  }

  openImageDialog(postId: string): void {
    console.log('openImageDialog', postId);
    const dialogRef = this.dialog.open(ImageViewDialogComponent, {
      width: '80%',
      height: '95vh',
      data: {
        postId,
        userId: this.myUserId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  isLoadMoreBtnVisible(): boolean {
    return this.currentPage >= this.totalPages - 1;
  }

}
