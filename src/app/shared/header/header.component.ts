import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, filter, firstValueFrom, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../services/user.service';
import { User, UserProfileData } from '../interfaces/user-profile-data';
import { WebSocketService } from '../notification-card/services/web-socket.service';

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

  isNewNotifications = false;


  constructor(private router: Router, private authService: AuthService, private userService: UserService, private webSocketService: WebSocketService) { }

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

    this.userService.userUpdatedInformation.subscribe((res: User) => {
      this.userInfo = res;
      this.userProfileImage = res.profileImageUrl;
    });
    this.webSocketService.newNotifications.subscribe((notification: any) => {
      this.isNewNotifications = true;
    });

  }

  fetchUserDetails() {
    this.authService.getUserId().then(userId => {
      if (!userId) {
        this.router.navigate(['/log-in']);
        return;
      }

      this.userService.getUserProfileInfo(userId).subscribe({
        next: (userProfile) => {
          this.userInfo = userProfile;
        },
        error: (error) => {
          console.error('Error fetching user profile data:', error);
        }
      });
    }).catch(error => {
      console.error('Error during user detail fetch operation:', error);
    });
  }

  logOut(): void {
    this.authService.logout()
    this.router.navigate(['/log-in']);
  }

  toggleDropdown(): void {
    this.showDropdownUser = !this.showDropdownUser;
  }

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  toggleNotificationCard(): void {
    this.isNotificationCardOpened = !this.isNotificationCardOpened;
    this.isNotificationCardOpened ? this.isNewNotifications = false : null;
  }

  openUserProfile(): void {
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
