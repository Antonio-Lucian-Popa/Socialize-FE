import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user-profile-data';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-suggestion-card',
  templateUrl: './suggestion-card.component.html',
  styleUrls: ['./suggestion-card.component.scss']
})
export class SuggestionCardComponent implements OnInit {

  @Input() isSeeAllVisible: boolean = true;

  suggestedUsers: User[] = [];

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if(userId) {
        this.userService.getSuggestedUsers(userId).subscribe((users) => {
          this.suggestedUsers = users;
        });
      }
    });
  }

}
