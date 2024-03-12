import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @Output() isClosed = new EventEmitter<boolean>();

  notifications = [
    {
      user: {
        firstName: 'Tommy',
        lastName: 'Lee',
        image: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      message: 'replied to you in Generic File',
      date: '7 November 2023 · 12:35 AM',
      isNew: true
    },
  ];

  constructor() { }

  ngOnInit(): void {
    // TODO: Fetch notifications from a service
  }

  closeNotificationCard(): void {
    this.isClosed.emit(true);
  }

}
