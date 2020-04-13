import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // adding a token to all outgoing requests
    // "take(1)" means we only take 1 value from this subject and automatically unsubscribe after
    // "exhaustMap()" waits for the first observable to be done, then replaces it with a new observable passed to it
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        const modifiedRequest = req.clone({ params: new HttpParams().set('auth', user.token) });
        return next.handle(modifiedRequest);
      })
    );
  }
}