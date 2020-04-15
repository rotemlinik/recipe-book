import { Component, ErrorHandler, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, 
              private router: Router,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    
    let authObservable: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      //authObservable = this.authService.login(email, password);
      this.store.dispatch(new authActions.LoginStart({email: email, password: password}));
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    /* authObservable.subscribe(
      responseData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }); */

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}