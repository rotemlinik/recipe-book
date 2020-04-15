import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {
  private authBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private keyQueryParam = '?key=' + environment.firebaseApiKey;
  private loginUrl = this.authBaseUrl + 'signInWithPassword' + this.keyQueryParam;

  // switchMap allows to create new observable by taking another observable's data
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => { 
      return this.httpClient.post<AuthResponseData>(this.loginUrl, this.createLoginData(authData.payload))
      .pipe(
        map(responseData => {
          const expirationDate = this.calcExpirationDate(+responseData.expiresIn);
          return new AuthActions.Login({
            email: responseData.email, 
            userId: responseData.localId, 
            token: responseData.idToken, 
            expirationDate: expirationDate
          });
        }),
        catchError(error => { // handle error in inner observable (when observable throws error it dies)
          return this.handleError(error);// return valid observable to enable login pickup in the next time
        })
      )
    }) 
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => this.router.navigate(['/']))
  )

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private router: Router) {}

  private calcExpirationDate(expiresIn: number): Date {
    const millisUntilTokenExipres = expiresIn * 1000;
    const currentTimeInMillis = new Date().getTime();

    return new Date(currentTimeInMillis + millisUntilTokenExipres);
  }

  private createLoginData(authData: {email: string, password: string}) {
    return {
      email: authData.email,
      password: authData.password,
      returnSecureToken: true
    }
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!'

    if (errorResponse.error && errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = "Oh no! It seems like a user with this email already exists!";
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'Oh no! A user with this email doesn\'t exists!';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'Oh no! The password you entered is incorrect!';
          break;
      }
    }

    return of(new AuthActions.LoginFail(errorMessage));
  }
}