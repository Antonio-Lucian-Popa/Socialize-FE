import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.scss']
})
export class ExploreCardComponent implements OnInit {

  exploreImages = [
    {
      id: 1,
      description: 'Explore the world',
      image: 'https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'assets/images/user-1.jpg'
      }
    },
    {
      id: 2,
      description: 'I love the world',
      image: 'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'assets/images/user-1.jpg'
      }
    },
    {
      id: 3,
      description: 'You only live once',
      image: 'https://images.unsplash.com/photo-1709428590519-cb6529ea40af?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'assets/images/user-1.jpg'
      }
    },
    {
      id: 4,
      description: 'Live your life',
      image: 'https://plus.unsplash.com/premium_photo-1676823570926-238f23020786?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      user: {
        id: 45,
        firstName: 'John',
        lastName: 'Doe',
        image: 'assets/images/user-1.jpg'
      }
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // TODO: Fetch data from API
  }

  openDiscovery(): void {
   this.router.navigate(['/discovery']);
  }

}
