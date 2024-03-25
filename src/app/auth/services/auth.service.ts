import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, from, of, tap, throwError } from 'rxjs';
import { CreateUser } from '../interfaces/createUser';

import { jwtDecode } from "jwt-decode";

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
    } else {
      formData.append('file', new Blob([]), 'empty');
    }

    return this.http.post(`${this.URL_LINK}/register`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // getToken(): string | null {
  //   return localStorage.getItem('jwt');
  // }

  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   // Check if the token is not expired
  //   return token != null && !this.jwtHelper.isTokenExpired(token);
  // }

  isJwtExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    const decoded: any = jwtDecode(token); // Use `any` or define a more specific type for your decoded token
    const expirationDate = decoded.exp * 1000; // JS deals with dates in milliseconds since epoch
    console.log(expirationDate)
    return Date.now() >= expirationDate;
  }

  async getToken(): Promise<string | null> {
    return await localStorage.getItem('jwt') ?? null; // Ensures that `undefined` is converted to `null`
  }

  async getUserId(): Promise<string | null> {
    const token = await this.getToken();
    console.log(token)
    if (token) {
      const decoded: any = jwtDecode(token); // Use `any` or define a more specific type for your decoded token
      return decoded.userId;
    }
    return null;
  }

  isAuthenticated(): Observable<boolean> {
    return from(this.getToken().then(token => !!token));
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  // getUserIdFromToken(): string | null {
  //   const token = this.getToken();
  //   console.log(this.jwtHelper.isTokenExpired(token));
  //   if (token && !this.jwtHelper.isTokenExpired(token)) {
  //     const decodedToken = this.jwtHelper.decodeToken(token);
  //     // Assuming 'user_id' is the key in the payload that holds the user ID
  //     return decodedToken.userId;
  //   }
  //   return null;
  // }

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
