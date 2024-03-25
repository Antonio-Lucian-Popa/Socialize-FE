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

  constructor(public dialog: MatDialog, private postService: PostService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if(userId) {
        this.userId = userId;
        this.checkIfPostIsLikedByUser();
      }
    });
  }

  checkIfPostIsLikedByUser(): void {
    this.isPostLiked = this.post.likes.some((like) => like.id === this.userId);
  }

  swiperConfig: any = {
    // Swiper configurations
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
  };

  openLikesDialog(post: any): void {
    this.dialog.open(LikePostModalComponent, {
      width: '500px',
      data: {likes: post.likes}
    });
  }

  openCommentDialog(post: any): void {
    this.dialog.open(CommentPostModalComponent, {
      width: '500px',
      data: {post: post}
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

}
