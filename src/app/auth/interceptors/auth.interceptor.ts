import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, switchMap, filter, take, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// State management for token refresh
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Add auth header if token exists
  const authReq = addAuthHeader(req);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if error is 401 and not already a refresh token request
      if (error.status === 401 && !authReq.url.includes('/auth/refresh-token')) {
        return handle401Error(authReq, next, authService);
      }

      return throwError(() => error);
    })
  );
};

function addAuthHeader(req: HttpRequest<unknown>): HttpRequest<unknown> {
  const token = localStorage.getItem('access_token');
  
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return req;
}

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((token: any) => {
        isRefreshing = false;
        refreshTokenSubject.next(token.access_token);
        
        // Retry the original request with new token
        return next(addAuthHeader(req));
      }),
      catchError((error) => {
        isRefreshing = false;
        
        // If refresh failed, logout user
        authService.logout();
        
        return throwError(() => error);
      })
    );
  } else {
    // If already refreshing, wait for the new token
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(() => next(addAuthHeader(req)))
    );
  }
}