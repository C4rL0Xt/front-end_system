import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../services/token-service/token.service';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export const resourceInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  let intReq = request;

  if(token != null && request.url.includes('resource')){
    intReq = request.clone({headers: request.headers.set('Authorization','Bearer ' + token)});
  }

  return next(intReq).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
