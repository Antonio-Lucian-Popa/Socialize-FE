import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';
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
      if (userId) {
        this.webSocketService.getNotifications(userId, 0, 5).subscribe((notifications: any) => {
          this.notifications = notifications.content;
        });
      }
    });

    this.webSocketService.newNotifications.subscribe((notification: any) => {
      this.notifications.unshift(notification);
    });
  }

  markAsRead(notificationId: string): void {
    this.webSocketService.markAsRead(notificationId).subscribe({
      next: (res) => {
        // Update the notification in the local array
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
      }
    });
  }

  closeNotificationCard(): void {
    this.isClosed.emit(true);
  }

}
