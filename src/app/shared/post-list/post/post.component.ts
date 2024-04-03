import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LikePostModalComponent } from '../../like-post-modal/like-post-modal.component';
import { CommentPostModalComponent } from '../../comment-post-modal/comment-post-modal.component';
import { PostDto } from '../../interfaces/post-dto';
import { PostService } from '../../services/post.service';
import { AuthService } from 'src/app/auth/services/auth.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: PostDto;

  userId!: string;

  isPostLiked: boolean = false;

  swiperConfig: any = {
    // Swiper configurations
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
  };

  constructor(
    public dialog: MatDialog,
    private postService: PostService,
    private authService: AuthService
    ) {
  }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if(userId) {
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
      data: {likes: post.likes}
    });
  }

  openCommentDialog(post: any): void {
    this.dialog.open(CommentPostModalComponent, {
      width: '500px',
      data: {
        post: post,
        userId: this.userId
      }
    });
  }

  toggleLikePost(): void {
    this.isPostLiked = !this.isPostLiked;
    // TODO: Send a request to like/unlike the post
    if(this.isPostLiked) {
      this.likePost(this.post.id);
    } else {
      this.unlikePost(this.post.id);
    }
  }

  likePost(postId: string) {
    this.postService.likePost(postId, this.userId).subscribe({
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
        console.log('Post deleted successfully', response);
        // Handle successful delete action, e.g., update UI accordingly
        this.postService.postDeleted.next(postId);
      },
      error: (error) => {
        console.error('Error deleting the post', error);
        // Handle error case
      },
    });
  }

}
