import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, filter, firstValueFrom, forkJoin, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user-profile-data';
import { WebSocketService } from '../notification-card/services/web-socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchControl: FormControl = new FormControl('');
  showDropdown: boolean = false;
  searchResults: User[] = [];

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
      filter(term => term === '' || (term && term.length > 0 )), // Ensure non-empty or reset
      switchMap(term => {
        if (term) {
          return this.userService.searchUsers(term);
        } else {
          // Immediately return an empty array when the term is empty
          return of([]);
        }
      })
    )
    .subscribe((results: any[]) => {
      if (results.length > 0) {
        this.searchResults = results;
        this.showDropdown = true;
      } else {
        this.showDropdown = false;
        this.searchResults = [];
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
    this.authService.logout().subscribe(res => {
      this.router.navigate(['/log-in']);
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
    this.isNotificationCardOpened ? this.isNewNotifications = false : null;
  }

  openUserProfile(userId?: string): void {
    this.closeDropDownUser();
    this.searchControl.reset();
    this.router.navigate(['/user-profile',  userId ? userId : this.userInfo.id]);
  }

  closeDropDownUser(): void {
    this.showDropdown = false;
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
