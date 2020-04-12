import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
  signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCuowidyXAOQqaVYQwYFKOPbKQNMCjFgYQ';
  loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCuowidyXAOQqaVYQwYFKOPbKQNMCjFgYQ';

  constructor(private httpClient: HttpClient) {}

  signUp(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      this.signUpUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      } 
    ).pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      this.loginUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError));
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