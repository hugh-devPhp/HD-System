import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);
  private api    = environment.apiUrl;

  isLoggedIn = signal(this.hasToken());

  login(email: string, password: string) {
    return this.http.post<TokenResponse>(`${this.api}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('hd_access',  res.access_token);
        localStorage.setItem('hd_refresh', res.refresh_token);
        this.isLoggedIn.set(true);
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    localStorage.removeItem('hd_access');
    localStorage.removeItem('hd_refresh');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('hd_access');
  }

  refreshToken() {
    const refresh = localStorage.getItem('hd_refresh');
    if (!refresh) return throwError(() => new Error('No refresh token'));
    return this.http.post<TokenResponse>(`${this.api}/auth/refresh`, { refresh_token: refresh }).pipe(
      tap(res => {
        localStorage.setItem('hd_access',  res.access_token);
        localStorage.setItem('hd_refresh', res.refresh_token);
      })
    );
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('hd_access');
  }
}
