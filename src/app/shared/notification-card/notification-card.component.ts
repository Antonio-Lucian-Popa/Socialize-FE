import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Notification } from '../interfaces/notification';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @Output() isClosed = new EventEmitter<boolean>();

  notifications: Notification[] = [];

  constructor(private webSocketService: WebSocketService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then(userId => {
      if(userId) {
        // TODO: Find a way to retreive the last 5 notifications
        this.webSocketService.getNotifications(0, 5).subscribe((notifications: any) => {
          this.notifications = notifications.content;
        });
      }
    });

    this.webSocketService.newNotifications.subscribe((notification: any) => {
      this.notifications.unshift(notification);
    });
  }

  closeNotificationCard(): void {
    this.isClosed.emit(true);
  }

}
