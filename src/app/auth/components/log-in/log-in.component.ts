import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { from, mergeMap, throwError } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage: string = "";

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
    ) { }

  ngOnInit(): void {
  }

  submit(): void {
    if(this.form.valid) {
      const { email, password } = this.form.value;
      // made a login request
      if(email && password) {
        const payload = {
          email, password
        }

        this.authService.login(payload).pipe(
          mergeMap(() => {
            // After successful login, get the user ID
            return from(this.authService.getUserId());
          }),
          mergeMap((userId: string | null) => {
            if (userId) {
              // Use the user ID to make another request, replace this with your actual method
              return this.userService.getUserProfileInfo(userId);
            } else {
              // Handle the case where user ID is null
              console.error('User ID is null');
              return throwError('User ID is null');
            }
          })
        ).subscribe({
          next: (res) => {
            // Handle the response from the second request
            console.log('User profile:', res);
            if (!res.userNew) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/welcome']);
            }
          },
          error: (err) => {
            // Handle the error from the second request
            console.error('Request failed:', err.error.message);
            // Show alert error or handle error
            this.errorMessage = err.error.message
          }
        });
      }
    }
  }

  checkRequiredField(fieldName: string): boolean {
    return this.form.get(fieldName)!.invalid && (this.form.get(fieldName)!.dirty || this.form.get(fieldName)!.touched) && this.form.get(fieldName)!.hasError('required')
  }

}
