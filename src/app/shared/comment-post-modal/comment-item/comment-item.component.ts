import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() comment: any;
  @Input() depth: number = 0; // Aggiungi questo
  @Output() reply = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onReply(comment: any): void {
    this.reply.emit(comment);
  }

}
