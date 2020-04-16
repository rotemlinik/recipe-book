import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';
import * as authActions from './auth.actions';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const userDataKey = 'userData';

const handleAuthentication = (responseData: AuthResponseData) => {
  const expirationDate = calcExpirationDate(+responseData.expiresIn);
  const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);
  localStorage.setItem(userDataKey, JSON.stringify(user));

  return new authActions.AuthenticateSuccess({
    email: responseData.email, 
    userId: responseData.localId, 
    token: responseData.idToken, 
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: HttpErrorResponse) => {
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

  return of(new authActions.AuthenticateFail(errorMessage));
}

const createAuthData = (authData: {email: string, password: string}) => {
  return {
    email: authData.email,
    password: authData.password,
    returnSecureToken: true
  }
}

const calcExpirationDate = (expiresIn: number): Date => {
  const millisUntilTokenExipres = expiresIn * 1000;
  const currentTimeInMillis = new Date().getTime();

  return new Date(currentTimeInMillis + millisUntilTokenExipres);
}

const parseUserDataFromLocalStorage = () => {
  const userData: {
    email: string, 
    id: string, 
    _token: string,
    _tokenExpirationDate: Date
  } = JSON.parse(localStorage.getItem(userDataKey));

  return userData;
}

@Injectable()
export class AuthEffects {
  private authBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private keyQueryParam = '?key=' + environment.firebaseApiKey;
  private loginUrl = this.authBaseUrl + 'signInWithPassword' + this.keyQueryParam;
  private signUpUrl = this.authBaseUrl + 'signUp' + this.keyQueryParam;

  // switchMap allows to create new observable by taking another observable's data
  // handle error in inner observable (when observable throws error it dies)
  // return valid observable to enable login pickup in the next time
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(authActions.SIGNUP_START),
    switchMap((signupAction: authActions.SignupStart) => {
      return this.httpClient.post<AuthResponseData>(this.signUpUrl, createAuthData(signupAction.payload))
      .pipe(
        tap(responseData => this.authService.setLogoutTimer(+responseData.expiresIn * 1000)),
        map(responseData => handleAuthentication(responseData)),
        catchError(error => handleError(error))
      )
    })
  )

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(authActions.LOGIN_START),
    switchMap((authData: authActions.LoginStart) => { 
      return this.httpClient.post<AuthResponseData>(this.loginUrl, createAuthData(authData.payload))
      .pipe(
        tap(responseData => this.authService.setLogoutTimer(+responseData.expiresIn * 1000)),
        map(responseData => handleAuthentication(responseData)),
        catchError(error => handleError(error))
      )
    }) 
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(authActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: authActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/'])
      }
    })
  )

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(authActions.LOGOUT),
    tap(() => {
      localStorage.removeItem(userDataKey);
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  )

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(authActions.AUTO_LOGIN),
    map(() => {
      {
        const userData = parseUserDataFromLocalStorage();
        if (!userData) {
          return { type: 'DUMMY' }
        }
    
        const loadedUser = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate);
        if (loadedUser.token) {
          this.authService.setLogoutTimer(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());

          return new authActions.AuthenticateSuccess({
            email: loadedUser.email, 
            userId: loadedUser.id, 
            token: loadedUser.token, 
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false});
        }

        return { type: 'DUMMY' }
      }
    })
  )

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private router: Router,
              private authService: AuthService) {}
}