import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit {

  activities: any[] = [
    {
      id: 1,
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      description: "Liked your post",
      createAt: "2021-04-20T10:00:00"
    },
    {
      id: 2,
      user: {
        id: 45,
        firstName: 'Aly',
        lastName: 'Allison',
        image: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      description: "Liked your post",
      createAt: "2021-04-20T10:00:00"
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // TODO: Fetch activities from the server, from notification endpoint and get the last 5 activities
  }

}
