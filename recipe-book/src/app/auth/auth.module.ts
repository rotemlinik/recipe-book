import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    // empty path because of lazy loading. at that point we are already on /auth
    RouterModule.forChild([
      { path: '', component: AuthComponent }
    ]),
    FormsModule,
    SharedModule 
  ]
})
export class AuthModule {}