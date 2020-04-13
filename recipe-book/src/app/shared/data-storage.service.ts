import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipeBookBackendUrl = 'https://recipe-book-backend-9f161.firebaseio.com/recipes.json';

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService, 
              private authService: AuthService) {}

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
        map(recipes => { return this.addIngredientsArrayIfMissing(recipes); }),
        tap(recipes => { this.recipeService.setRecipes(recipes); })
      );
  }

  private addIngredientsArrayIfMissing(recipes: Recipe[]) {
    return recipes.map(recipe => {
      return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : null};
    });
  }
}