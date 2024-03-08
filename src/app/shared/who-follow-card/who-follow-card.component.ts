import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-who-follow-card',
  templateUrl: './who-follow-card.component.html',
  styleUrls: ['./who-follow-card.component.scss']
})
export class WhoFollowCardComponent implements OnInit {

  peopleToFollow = [
    {
      id: 1,
      firstName: 'Scarlett',
      lastName: 'Johansson',
      handle: 'floyds',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
     {
      id: 2,
      firstName: 'Rohan',
      lastName: 'Mckenzie',
      handle: 'floyds',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
  ];

  constructor() { }

  ngOnInit(): void {
    // TODO: Fetch people to follow
  }


  followPerson(person: any): void {
    // Implement follow functionality
    console.log('Followed', person.handle);
    // Here you might update the person's status or send a request to your backend
  }

}
