import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, from, mergeMap, throwError } from 'rxjs';
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
    if (this.form.valid) {
      const { email, password } = this.form.value;
      // made a login request
      if (email && password) {
        const payload = {
          email, password
        }

        this.authService.login(payload).pipe(
          catchError((loginError) => {
            // Show alert error or handle error
            this.errorMessage = loginError.error.message;
            return throwError(loginError);
          }),
          mergeMap(() => {
            // After successful login, get the user ID
            return from(this.authService.getUserId()).pipe(
              catchError((userIdError) => {
                this.errorMessage = userIdError.error.message;
                return throwError(userIdError);
              })
            );
          }),
          mergeMap((userId: string | null) => {
            if (userId) {
              return this.userService.getUserProfileInfo(userId).pipe(
                catchError((userProfileError) => {
                  this.errorMessage = userProfileError.error.message;
                  return throwError(userProfileError);
                })
              );
            } else {
              // Handle the case where user ID is null
              return throwError('User ID is null');
            }
          })
        ).subscribe({
          next: (res) => {
            // Handle the response from the second request
            if (!res.userNew) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/welcome']);
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message;
          }
        });

      }
    }
  }

  checkRequiredField(fieldName: string): boolean {
    return this.form.get(fieldName)!.invalid && (this.form.get(fieldName)!.dirty || this.form.get(fieldName)!.touched) && this.form.get(fieldName)!.hasError('required')
  }

}
