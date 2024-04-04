import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { FormBuilder } from '@angular/forms';

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

  editCommentForm = this.fb.group({
    value: [''],
  });

  isEditPanelOpen = false;

  constructor(private commentService: CommentService, private userService: UserService, private fb: FormBuilder) { }

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

  editComment(commentId: string): void {
    // Implement edit comment logic here
    this.editCommentForm.get('value')!.setValue(this.comment.value);
    console.log('Editing comment with id:', commentId);
    this.isEditPanelOpen = true;
  }

  updateComment(): void {
    const payload = {
      value: this.editCommentForm.get('value')!.value,
      postId: this.comment.postId,
      userId: this.comment.userDto.id,
    }
    this.commentService.editComment(this.comment.id, this.userId, payload).subscribe({
      next: (response) => {
        console.log('Comment edited successfully', response);
        this.comment.value = response.value;
        this.isEditPanelOpen = false;
        // Handle successful edit action, e.g., update UI accordingly
      },
      error: (error) => {
        console.error('Error editing comment', error);
        // Handle error case
      },
    });
  }


}
