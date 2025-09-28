import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { UserLoginDTO, UserCreateDTO, TokenDTO, UserResponseDTO } from '../types/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly isAuthenticated = signal<boolean>(this.hasValidToken());
  readonly currentUser = signal<UserResponseDTO | null>(null);

  private hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Initialize authentication state
  initializeAuth(): void {
    if (this.hasValidToken()) {
      this.isAuthenticated.set(true);
      this.getCurrentUser().subscribe({
        error: () => {
          // If getting current user fails, try refresh token
          this.tryRefreshToken();
        }
      });
    } else {
      // No access token, try refresh token
      this.tryRefreshToken();
    }
  }

  private tryRefreshToken(): void {
    this.refreshToken().subscribe({
      next: () => {
        // Successfully refreshed, get current user
        this.getCurrentUser().subscribe();
      },
      error: () => {
        // No valid refresh token, user needs to login
        this.isAuthenticated.set(false);
      }
    });
  }

  login(credentials: UserLoginDTO): Observable<TokenDTO> {
    return this.apiService.post<TokenDTO>('/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        this.isAuthenticated.set(true);
        this.getCurrentUser().subscribe();
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: UserCreateDTO): Observable<TokenDTO> {
    return this.apiService.post<TokenDTO>('/auth/register', userData).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        this.isAuthenticated.set(true);
        this.getCurrentUser().subscribe();
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<UserResponseDTO> {
    return this.apiService.get<UserResponseDTO>('/auth/me').pipe(
      tap(user => this.currentUser.set(user)),
      catchError(error => {
        console.error('Failed to get current user:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.apiService.post('/auth/logout', {}).subscribe({
      complete: () => {
        this.clearAuthData();
      },
      error: () => {
        this.clearAuthData();
      }
    });
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<TokenDTO> {
    return this.apiService.post<TokenDTO>('/auth/refresh-token', {}).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        this.isAuthenticated.set(true);
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        // Don't call logout here to avoid infinite loops
        // Just clear the local data and redirect
        localStorage.removeItem('access_token');
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }
}
