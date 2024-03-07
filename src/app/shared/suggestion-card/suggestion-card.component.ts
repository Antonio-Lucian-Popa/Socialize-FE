import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestion-card',
  templateUrl: './suggestion-card.component.html',
  styleUrls: ['./suggestion-card.component.scss']
})
export class SuggestionCardComponent implements OnInit {

  suggestedUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      recommendation: 'Recently joined',
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
