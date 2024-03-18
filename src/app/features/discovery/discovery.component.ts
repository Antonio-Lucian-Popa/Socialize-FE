import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewDialogComponent } from './image-view-dialog/image-view-dialog.component';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.scss']
})
export class DiscoveryComponent implements OnInit {

  popularImages = [
    {id: 1, image: 'https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {id: 2, image: 'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {id: 3, image: 'https://images.unsplash.com/photo-1707343848655-a196bfe88861?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {id: 4, image: 'https://images.unsplash.com/photo-1710743385110-23d273762d14?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {id: 5, image: 'https://images.unsplash.com/photo-1710596039020-b93566d8106b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {id: 6, image: 'https://images.unsplash.com/photo-1710695174960-59026cbac187?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
  ];

  loading: boolean = true;
  private imagesLoaded = 0;
  currentPage = 0;
  totalPages = undefined; // Assume this comes from your backend


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    if ((this.totalPages && this.currentPage < this.totalPages) || this.totalPages === undefined) {
      this.loading = true;
      // this.yourService.getImages(this.currentPage).subscribe(data => {
      //   const newImages = data.images; // Adapt based on your actual data structure
      //   this.totalPages = data.totalPages; // Update total pages
      //   this.popularImages = [...this.popularImages, ...newImages];
      //   this.currentPage++;
      //   // Reset loading state and counter if this is a new load
      //   this.imagesLoaded = 0;
      //   // Don't set loading to false here; let imageLoaded handle it
      // });
    }
  }

  imageLoaded(): void {
    this.imagesLoaded++;
    if (this.imagesLoaded === this.popularImages.length) {
      this.loading = false;
    }
  }

  // Call this method to load more images
  loadMore(): void {
    this.loadImages();
  }

  openImageDialog(imageId: number): void {
    console.log('openImageDialog', imageId);
    const dialogRef = this.dialog.open(ImageViewDialogComponent, {
      width: '80%',
      height: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
