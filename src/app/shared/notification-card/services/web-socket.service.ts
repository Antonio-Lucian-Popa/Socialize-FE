import { Injectable, EventEmitter, Output } from '@angular/core';

import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notification } from '../../interfaces/notification';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

   URL_LINK = environment.apiUrl + '/api/v1';
  //URL_LINK = 'https://socialize-be.go.ro:2347/api/v1/notifications';


  @Output() newNotifications = new EventEmitter<any>();

  private stompClient: any;

  constructor(private http: HttpClient) {}

  connect(userId: string) {
    const socket = new SockJS(environment.apiUrl + '/ws');
  this.stompClient = new Client({
    webSocketFactory: () => socket
  });

  this.stompClient.onConnect = (frame: any) => {
    console.log('Connected: ' + frame);

    this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (notification: any) => {
      console.log('Notification:', notification.body);
      this.newNotifications.emit(notification.body);
      // Handle the notification, e.g., display it in the UI
    });
  };

  this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  getNotifications(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.URL_LINK}/notifications/findNotifications`, { params });
  }
}
