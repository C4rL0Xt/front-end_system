import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../services/token-service/token.service';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const resourceInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  const router = inject(Router);
  let intReq = request;

  if (token != null) {
    intReq = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
  }

  return next(intReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};