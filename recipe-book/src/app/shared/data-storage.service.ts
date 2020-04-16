import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import * as fromApp from '../store/app.reducer';
import * as recipeActions from '../recipes/store/recipe.actions';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipeBookBackendUrl = 'https://recipe-book-backend-9f161.firebaseio.com/recipes.json';

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.httpClient
      .put(this.recipeBookBackendUrl, recipes)
      .subscribe(response => console.log(response))
  }

  getRecipes() {
    return this.httpClient
      .get<Recipe[]>(this.recipeBookBackendUrl)
      .pipe(
        map(recipes => this.addIngredientsArrayIfMissing(recipes)),
        tap(recipes => this.store.dispatch(new recipeActions.SetRecipes(recipes)))
      );
  }

  private addIngredientsArrayIfMissing(recipes: Recipe[]) {
    return recipes.map(recipe => {
      return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : null};
    });
  }
}