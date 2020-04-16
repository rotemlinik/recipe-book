import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  storeSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) { return; }

    const email = form.value.email;
    const password = form.value.password;
    
    if (this.isLoginMode) {
      this.store.dispatch(new authActions.LoginStart({email: email, password: password}));
    } else {
      this.store.dispatch(new authActions.SignupStart({email: email, password: password}));
    }

    form.reset();
  }
}