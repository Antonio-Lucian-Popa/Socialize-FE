import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() comment: any;
  @Input() depth: number = 0; // Aggiungi questo
  @Output() reply = new EventEmitter<any>();
  @Output() deleteCommentId = new EventEmitter<string>();

  userId!: string;

  constructor(private commentService: CommentService, private userService: UserService) { }

  ngOnInit(): void {
    console.log(this.comment.subComments);
    this.userId = this.userService.userInfo.id;
   }

  onReply(comment: any): void {
    this.reply.emit(comment);
  }

  onDeleteComment(commentId: string): void {
    this.deleteCommentId.emit(commentId);
  }

  isUserOwnerOfComment(): boolean {
    return this.comment.userDto.id === this.userId;
  }

  deleteComment(commentId: string): void {
    // Implement delete comment logic here
    console.log('Deleting comment with id:', commentId);
    if(this.userId) {
      this.commentService.deleteComment(commentId, this.userId).subscribe({
        next: (response) => {
          console.log('Comment deleted successfully', response);
          this.deleteCommentId.emit(commentId);
          // Handle successful delete action, e.g., update UI accordingly
        },
        error: (error) => {
          console.error('Error deleting comment', error);
          // Handle error case
        },
      });
    }
  }

}
