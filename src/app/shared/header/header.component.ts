import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, filter, firstValueFrom, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../services/user.service';
import { UserProfileData } from '../interfaces/user-profile-data';

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

  userId!: string;
  userInfo: any;
  userProfileImage!: string;

  isMenuOpened = false;


  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.fetchUserDetails();

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

      this.userService.userUpdatedInformation.subscribe((res: UserProfileData) => {
        this.userInfo = res.userInfo;
        this.userProfileImage = res.userProfileImage;
      });
  }

  fetchUserDetails() {
    this.authService.getUserId().then(userId => {
      if (!userId) {
        console.log('No valid user ID available');
        this.router.navigate(['/log-in']);
        return;
      }

      this.userService.fetchUserProfile(userId).subscribe({
        next: (data) => {
          this.userInfo = data.userInfo;
          this.userProfileImage = data.userProfileImage;
          console.log('Fetched User Profile Data:', data);
        },
        error: (error) => {
          console.error('Error fetching user profile data:', error);
        }
      });
    }).catch(error => {
      console.error('Error during user detail fetch operation:', error);
    });
  }



  toggleDropdown(): void {
    this.showDropdownUser = !this.showDropdownUser;
  }

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  toggleNotificationCard(): void {
    this.isNotificationCardOpened = !this.isNotificationCardOpened;
  }

  openUserProfile(): void {
    console.log('Opening user profile...');
    // TODOO: retreive from auth service the user id from token
    this.closeDropDownUser();
    this.router.navigate(['/user-profile', this.userInfo.id]);
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
