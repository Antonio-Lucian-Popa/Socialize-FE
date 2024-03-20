import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LikePostModalComponent } from '../../like-post-modal/like-post-modal.component';
import { CommentPostModalComponent } from '../../comment-post-modal/comment-post-modal.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;

  isPostLiked: boolean = false;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log(this.post)
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

  toggleLikePost(post: any): void {
    this.isPostLiked = !this.isPostLiked;
    // TODO: Send a request to like/unlike the post
  }

}
