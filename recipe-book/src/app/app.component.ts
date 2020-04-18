import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import * as authActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>,
              @Inject(PLATFORM_ID) private platformId) {}

  ngOnInit() {
    // to only auto login if we run on browser, because auto-login uses local storage which is a browser API,
    // and on server (where component is pre rendered) local storage does not exist
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new authActions.AutoLogin());
    }
  }
}
