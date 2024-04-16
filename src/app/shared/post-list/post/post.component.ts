import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LikePostModalComponent } from '../../like-post-modal/like-post-modal.component';
import { CommentPostModalComponent } from '../../comment-post-modal/comment-post-modal.component';
import { PostDto } from '../../interfaces/post-dto';
import { PostService } from '../../services/post.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { EditPostModalComponent } from './edit-post-modal/edit-post-modal.component';
import { register } from 'swiper/element';
import Swiper from 'swiper';
import * as _ from 'lodash';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @ViewChild('swiperRef')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  ngAfterViewInit(): void {
    register();
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  onActiveIndexChange() {
    console.log(this.swiper?.activeIndex);
  }
  @Input() post!: PostDto;

  userId!: string;

  isPostLiked: boolean = false;

  swiperConfig: any = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: {
      type: 'bullets',
      clickable: true
    },
  };


  constructor(
    public dialog: MatDialog,
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if (userId) {
        this.userId = userId;
        this.checkIfPostIsLikedByUser();
      }
    });
  }

  /**
   * Check if the post is liked by the current user
   */
  checkIfPostIsLikedByUser(): void {
    this.isPostLiked = this.post.likes.some((like) => like.id === this.userId);
  }

  /**
   *
   * @returns true if the post is of the current user, false otherwise
   */
  checkIfPostIsOfCurrentUser(): boolean {
    return this.post.user.id === this.userId;
  }

  openLikesDialog(post: any): void {
    this.dialog.open(LikePostModalComponent, {
      width: '500px',
      data: { likes: post.likes }
    });
  }

  openCommentDialog(post: any): void {
    const dialogRef = this.dialog.open(CommentPostModalComponent, {
      width: '500px',
      data: {
        post: post,
        userId: this.userId
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('The dialog was closed', result);
        if (result) {
          // Handle successful comment action, e.g., update UI accordingly
          this.refreshPost();
        }

      },
      error: (error) => {
        console.error('Error closing dialog', error);
        // Handle error case
      }
    });
  }

  refreshPost() {
    this.postService.getPostById(this.post.id).subscribe({
      next: (response) => {
        console.log('Post fetched successfully', response);
        // Handle successful fetch action, e.g., update UI accordingly
        this.post = response;
      },
      error: (error) => {
        console.error('Error fetching post', error);
        // Handle error case
      },
    });
  }

  toggleLikePost(): void {
    this.isPostLiked = !this.isPostLiked;
    // TODO: Send a request to like/unlike the post
    if (this.isPostLiked) {
      this.likePost(this.post.id);
    } else {
      this.unlikePost(this.post.id);
    }
  }

  likePost(postId: string) {
    this.postService.likePost(postId, this.userId).subscribe({
      next: (response) => {
        // Handle successful like action, e.g., update UI accordingly
        this.post.likes = response.likes;
      },
      error: (error) => {
        console.error('Error liking the post', error);
        // Handle error case
      },
    });
  }

  unlikePost(postId: string) {
    this.postService.unlikePost(postId, this.userId).subscribe({
      next: (response) => {
        console.log('Post liked successfully', response);
        // Handle successful like action, e.g., update UI accordingly
        this.post.likes = response.likes;
      },
      error: (error) => {
        console.error('Error liking the post', error);
        // Handle error case
      },
    });
  }

  deletePost(postId: string) {
    this.postService.deletePostById(postId, this.userId).subscribe({
      next: (response) => {
        // Handle successful delete action, e.g., update UI accordingly
        this.postService.postDeleted.next(postId);
      },
      error: (error) => {
        console.error('Error deleting the post', error);
        // Handle error case
      },
    });
  }

  editPost() {
    const dialogRef = this.dialog.open(EditPostModalComponent, {
      width: '500px',
      data: {
        post: this.post,
        user: this.userService.userInfo,
        profileImageUrl: this.userService.userInfo.profileImageUrl
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (Array.isArray(result)) {
        // Use _.remove to mutate the original array, removing items that match the condition
        _.remove(this.post.imageFilenames, (filename) => result.includes(filename));

        // After modifying the array, ensure you update any dependent components or services, like Swiper
        setTimeout(() => {
          this.swiper?.update(); // Inform Swiper about the update
        }, 0);
      } else if (result) {
        // Handle successful edit action, e.g., update UI accordingly
        this.updatePost(result);
      }
    })
  }

  updatePost(post: PostDto) {
    this.post.description = post.description; // Update the description
    this.post.imageFilenames = post.imageFilenames; // Update the image array
    setTimeout(() => {
      this.swiper?.update(); // Inform Swiper about the update
    }, 0);

  }

  slideChange(swiper: any) {
    console.log(swiper)
  }

}
