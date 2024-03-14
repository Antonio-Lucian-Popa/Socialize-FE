import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable, from, mergeMap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Bypass interceptor for login and registration requests
    if (request.url.endsWith('/authenticate') || request.url.endsWith('/register')) {
      return next.handle(request);
    }

    return from(this.auth.getToken() || '').pipe(
      mergeMap(token => {
        console.log(token);
        if (token) {
          if (this.auth.isTokenExpired(token)) {
            this.auth.logout();
            this.router.navigate(['/log-in']);
            // For expired token cases, you might want to halt the request or handle differently
            return EMPTY; // This stops the request from proceeding further
          } else {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
        }
        return next.handle(request);
      })
    );
  }

}
