import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor() { }

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

}
