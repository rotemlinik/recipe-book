import { Injectable, Output, EventEmitter } from "@angular/core";
import { Recipe } from './recipe.model';

@Injectable({providedIn: 'root'})
export class RecipeService {
    recipeWasSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe("Tasty Ultimate Lasagna", "the best yummy lasagna ever", "https://img.buzzfeed.com/video-api-prod/assets/01cfdd3c80844c63baae4784b53df3f4/FB_2.jpg"),
        new Recipe("Banana Bread", "yummy in the tummy", "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/55ac7efd43d74a6ead6576b4bfb28d7e/FB_Syphus_BananaBread_v3.jpg")
    ];

    getRecipes() {
        return this.recipes.slice(); // the use of 'slice' with no arguments returns copy of the array
    }
}