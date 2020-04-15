import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as fromApp from '../store/app.reducer';
import * as shoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  listChangedSubscription: Subscription;
  @Input() userContentSelection: string;

  // store type is: store with a shopping list area, and in this area data will be held in an object
  // with the key 'ingredients' and it holds an Ingredients array
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this will handle both initialize ingredients at start up, 
    // and updating it via subscribing to any future state change
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(new shoppingListActions.StartEdit(index));
  }
}
