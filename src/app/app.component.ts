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
  isRegister: boolean = true;
  isWelcome: boolean = true;

  private routerSubscription!: Subscription;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !event.url.endsWith('/log-in');
        this.isRegister = !event.url.endsWith('/sign-up');
        this.isWelcome = !event.url.endsWith('/welcome');
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    // Unsubscribe to ensure no memory leaks
    this.routerSubscription.unsubscribe();
  }

  isHeaderVisible(): boolean {
    return this.isLoggedIn && this.isRegister && this.isWelcome;
  }
}
