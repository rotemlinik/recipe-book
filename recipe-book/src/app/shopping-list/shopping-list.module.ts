import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: 'shopping-list', component: ShoppingListComponent }
    ]),
    FormsModule,
    CommonModule // for ngIf & ngFor, since BrowserModule can only be used once in an app (it does some app start-up things as well)
  ]
})
export class ShoppingListModule {}