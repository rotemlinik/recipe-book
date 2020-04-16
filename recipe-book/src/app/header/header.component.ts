import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as authActions from '../auth/store/auth.actions';
import * as recipeActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    isAuthenticated = false;
    userSubscription: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
      this.userSubscription = this.store
        .select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
          this.isAuthenticated = user != null;
        });
    }

    ngOnDestroy() {
      this.userSubscription.unsubscribe();
    }

    onSaveRecipes() {
      this.store.dispatch(new recipeActions.StoreRecipes());
    }

    onFetchRecipes() {
      this.store.dispatch(new recipeActions.FetchRecipes());
    }

    onLogout() {
      this.store.dispatch(new authActions.Logout());
    }
}