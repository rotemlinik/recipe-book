import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';

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
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(millisUntilTokenExipres: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new authActions.Logout());
    }, millisUntilTokenExipres)
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}