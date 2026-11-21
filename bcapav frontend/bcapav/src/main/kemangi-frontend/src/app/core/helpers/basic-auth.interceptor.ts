import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const basicAuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const user = authService.currentUserValue;

  if (user && user.access_token && !req.url.includes('auth/refresh')) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
