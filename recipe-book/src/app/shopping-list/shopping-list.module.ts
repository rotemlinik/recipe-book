import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    // empty path because of lazy loading. at that point we are already on /shopping-list
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent } 
    ]),
    FormsModule,
    SharedModule 
  ]
})
export class ShoppingListModule {}