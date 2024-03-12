import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchControl: FormControl = new FormControl('');
  showDropdown: boolean = false;
  searchResults: string[] = [];

  showDropdownUser: boolean = false;

  isNotificationCardOpened: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        filter(term => term.length > 0 || term === '') // Ensure non-empty or reset
      )
      .subscribe(term => {
        if (term.length > 0) {
          // Simulate fetching search results, e.g., from a service
          this.searchResults = ['Result 1', 'Result 2', 'Result 3']; // Static results for demonstration
          this.showDropdown = true;
        } else {
          this.showDropdown = false;
        }
      });
  }

  toggleDropdown(): void {
    this.showDropdownUser = !this.showDropdownUser;
  }

  toggleNotificationCard(): void {
    this.isNotificationCardOpened = !this.isNotificationCardOpened;
  }

  openUserProfile(): void {
    console.log('Opening user profile...');
    // TODOO: retreive from auth service the user id from token
    this.closeDropDownUser();
    this.router.navigate(['/user-profile', '123']);
  }

  closeDropDownUser(): void {
    this.showDropdownUser = false;
  }

  goToHomePage(): void {
    this.router.navigate(['/home']);
  }

  checkNotificationOpeningStatus(event: any): void {
    if (this.isNotificationCardOpened) {
      this.isNotificationCardOpened = false;
    }
  }
}
