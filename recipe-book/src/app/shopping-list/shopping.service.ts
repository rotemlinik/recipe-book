import { Injectable, EventEmitter } from "@angular/core";
import { Ingredient } from '../shared/ingredient.model';

@Injectable({providedIn: 'root'})
export class ShoppingService {
    ingredientsListChanged = new EventEmitter<void>();
    private ingredients: Ingredient[] = [
        new Ingredient("tomatoes", 3),
        new Ingredient("minced beef", 1)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    addProduct(ingredient: Ingredient) {
        let ingredientFromShoppingList = this.ingredients.find((itemInList) => itemInList.name === ingredient.name );

        if (ingredientFromShoppingList != null) {
            ingredientFromShoppingList.amount += ingredient.amount;
        } else {
            this.ingredients.push(ingredient);
        }
        
        this.ingredientsListChanged.emit();
    }
}