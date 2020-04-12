import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable({providedIn: 'root'})
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];

    /* private recipes: Recipe[] = [
        new Recipe("Tasty Ultimate Lasagna", 
                   "the best yummy lasagna ever", 
                   "https://img.buzzfeed.com/video-api-prod/assets/01cfdd3c80844c63baae4784b53df3f4/FB_2.jpg",
                   [new Ingredient('minced beef', 1), new Ingredient('tomatoes', 4), new Ingredient('ricotta cheese', 1)]),
        new Recipe("Banana Bread", 
                   "yummy in the tummy", 
                   "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/55ac7efd43d74a6ead6576b4bfb28d7e/FB_Syphus_BananaBread_v3.jpg",
                   [new Ingredient('ripe bananas', 3), new Ingredient('butter', 1), new Ingredient('flour', 1)])
    ]; */

    getRecipes() {
        return this.recipes.slice(); // the use of 'slice' with no arguments returns copy of the array
    }

    getRecipe(id: number): Recipe {
        return this.recipes[id];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.triggerRecipesChanged();
      }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.triggerRecipesChanged();
      }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.triggerRecipesChanged();
    }

    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes;
      this.triggerRecipesChanged();
    }

    private triggerRecipesChanged() {
      this.recipesChanged.next(this.recipes.slice());
    }
}