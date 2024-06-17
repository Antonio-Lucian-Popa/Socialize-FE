import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 400 && error.status < 500) {
          // Handle the 500 error here
          console.error('Server error:', error);
          // Redirect to an error page or display an error message
          // For example:
          this.router.navigate(['/log-in']);
        }
        // Pass the error along to the calling code
        return throwError(error);
      })
    );
  }
}
