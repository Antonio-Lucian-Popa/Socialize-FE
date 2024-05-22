import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, from, of, switchMap, tap, throwError } from 'rxjs';
import { CreateUser } from '../interfaces/createUser';

import { jwtDecode } from "jwt-decode";
import { environment } from 'src/environments/environment';

export interface Token {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL_LINK = environment.apiUrl + '/api/v1';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(payload: any): Observable<Token | null> {
    return this.http.post<Token>(`${this.URL_LINK}/auth/authenticate`, payload).pipe(
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
    const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
    formData.append('request', userBlob);

    // Append file if present
    if (file) {
      formData.append('file', file, file.name);
    } else {
      formData.append('file', new Blob([]), 'empty');
    }

    return this.http.post(`${this.URL_LINK}/auth/register`, formData).pipe(
      catchError(this.handleError)
    );
  }

  validateToken(token: string): Observable<boolean> {
    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<boolean>(`${this.URL_LINK}/auth/validate-token`, {}, { headers });
  }


  isJwtExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000; // JS deals with dates in milliseconds since epoch
    return Date.now() >= expirationDate;
  }

  async getToken(): Promise<string | null> {
    return await localStorage.getItem('jwt') ?? null; // Ensures that `undefined` is converted to `null`
  }

  async getUserId(): Promise<string | null> {
    const token = await this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.userId;
    }
    return null;
  }

  isAuthenticated(): Observable<boolean> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        if (token && !this.isJwtExpired(token)) {
          return this.validateToken(token);
        } else {
          return of(false);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getUserInfo(userId: string): Observable<any> {
    const URL_LINK = environment.apiUrl + '/api/v1/users';
    return this.http.get<any>(`${URL_LINK}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the error according to your application's needs
    return throwError(error.message || 'Server error');
  }
}
