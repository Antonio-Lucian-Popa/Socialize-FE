import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user-profile-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-card',
  templateUrl: './suggestion-card.component.html',
  styleUrls: ['./suggestion-card.component.scss']
})
export class SuggestionCardComponent implements OnInit {

  suggestedUsers: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getSuggestedUsers().subscribe((users) => {
      this.suggestedUsers = users;
    });
  }

}
