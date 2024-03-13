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

  private routerSubscription!: Subscription;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !event.url.endsWith('/log-in');
        this.isRegister = !event.url.endsWith('/sign-up');
        console.log(this.isRegister, this.isLoggedIn);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to ensure no memory leaks
    this.routerSubscription.unsubscribe();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
