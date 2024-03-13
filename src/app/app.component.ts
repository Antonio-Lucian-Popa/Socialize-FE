import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'socialize-fe';

  isLoggedIn: boolean = true;

  private routerSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoginRoute();
      }
    });
  }

  private checkLoginRoute() {
    const url = this.router.url;
    this.isLoggedIn = !url.endsWith('/log-in');
  }

  ngOnDestroy() {
    // Unsubscribe to ensure no memory leaks
    this.routerSubscription.unsubscribe();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
