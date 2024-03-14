import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { CreateUser } from '../interfaces/createUser';

export interface Token {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL_LINK = 'http://localhost:8081/api/v1/auth';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(payload: any): Observable<Token | null> {
    return this.http.post<Token>(`${this.URL_LINK}/authenticate`, payload).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.access_token); // Store JWT token
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  register(userData: CreateUser, file?: File): Observable<any> {
    const formData = new FormData();

    // Append user data with explicit Content-Type for the JSON part
    // Note: Adding a filename for the JSON blob part ("request.json") might help.
    const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
    formData.append('request', userBlob); // Notice the 'request.json' filename

    // Append file if present
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.post(`${this.URL_LINK}/register`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Check if the token is not expired
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    return token != null && this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Assuming 'user_id' is the key in the payload that holds the user ID
      return decodedToken.userId;
    }
    return null;
  }

  getUserInfo(userId: string): Observable<any> {
    const URL_LINK = 'http://localhost:8081/api/v1/users';
    return this.http.get<any>(`${URL_LINK}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the error according to your application's needs
    return throwError(error.message || 'Server error');
  }
}
