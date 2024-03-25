import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId!: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then(userId => {
      if(userId) {
        this.userId = userId;
      }
    });
  }

}
