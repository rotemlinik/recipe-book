import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

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
  constructor(private shoppingService: ShoppingService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) { }

  ngOnInit(): void {
    // this will handle both initialize ingredients at start up, 
    // and updating it via subscribing to any future state change
    this.ingredients = this.store.select('shoppingList');
    
    /* this.ingredients = this.shoppingService.getIngredients();
      this.listChangedSubscription = this.shoppingService.ingredientsListChanged.subscribe(() => {
      this.ingredients = this.shoppingService.getIngredients();
    }) */
  }

  onEditItem(index: number) {
    this.shoppingService.startedEditing.next(index);
  }
}
