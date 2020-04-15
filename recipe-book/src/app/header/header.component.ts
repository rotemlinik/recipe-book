import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    isAuthenticated = false;
    userSubscription: Subscription;

    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService,
                private store: Store<fromApp.AppState>) {}

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
      this.dataStorageService.storeRecipes();
    }

    onFetchRecipes() {
      this.dataStorageService.getRecipes().subscribe();
    }

    onLogout() {
      this.authService.logout();
    }
}