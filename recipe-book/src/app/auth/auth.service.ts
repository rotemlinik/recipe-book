import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {
  authBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  keyQueryParam = '?key=AIzaSyCuowidyXAOQqaVYQwYFKOPbKQNMCjFgYQ';
  signUpUrl = this.authBaseUrl + 'signUp' + this.keyQueryParam;
  loginUrl = this.authBaseUrl + 'signInWithPassword' + this.keyQueryParam;
  user = new BehaviorSubject<User>(null);

  constructor(private httpClient: HttpClient,
              private router: Router) {}

  signUp(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      this.signUpUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      } 
    ).pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
  }

  login(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      this.loginUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  autoLogin() {
    const userData: {
      email: string, 
      id: string, 
      _token: string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate);
    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  private handleAuthentication(responseData: AuthResponseData) {
    console.log("in handleeeeeee")
    const millisecondToExpiration = +responseData.expiresIn * 1000;
    const currentTimeInMillis = new Date().getTime();
    const expirationDate = new Date(currentTimeInMillis + millisecondToExpiration);
    const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user)); // save user data so login state will survive app reload
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

    return throwError(errorMessage);
  }
}