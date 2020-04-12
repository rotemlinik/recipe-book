import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipeBookBackendUrl = 'https://recipe-book-backend-9f161.firebaseio.com/posts.json';

  constructor(private httpClient: HttpClient,
    private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.httpClient
      .put(this.recipeBookBackendUrl, recipes)
      .subscribe(response => {
        console.log(response);
      })
  }

  getRecipes() {
    return this.httpClient
      .get<Recipe[]>(this.recipeBookBackendUrl)
      .pipe(
        map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : null};
        });
      }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      )
  }
}