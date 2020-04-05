import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({providedIn: 'root'})
export class ShoppingService {
    ingredientsListChanged = new Subject<void>();
    startedEditing = new Subject<number>();
    
    private ingredients: Ingredient[] = [
        new Ingredient("tomatoes", 3),
        new Ingredient("minced beef", 1)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        let ingredientFromShoppingList = this.ingredients.find((itemInList) => itemInList.name === ingredient.name );

        if (ingredientFromShoppingList != null) {
            ingredientFromShoppingList.amount += ingredient.amount;
        } else {
            this.ingredients.push(ingredient);
        }
        
        this.ingredientsListChanged.next();
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsListChanged.next();
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsListChanged.next();
    }
}