import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, of, tap } from 'rxjs';
import { CreateUser } from '../interfaces/createUser';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL_LINK = 'http://localhost:8080/api/auth';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse | null> {
    return this.http.post<LoginResponse>(`${this.URL_LINK}/authenticate`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.token); // Store JWT token
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  register(userData: CreateUser): Observable<any> {
    return this.http.post(`${this.URL_LINK}/register`, userData).pipe(
      catchError(error => {
        console.error('Registration failed:', error);
        return of(null); // Return null in case of error
      })
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

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Assuming 'user_id' is the key in the payload that holds the user ID
      return decodedToken.user_id;
    }
    return null;
  }
}
