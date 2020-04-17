import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import * as recipeActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipeBookBackendUrl = 'https://recipe-book-backend-9f161.firebaseio.com/recipes.json';

  constructor(private httpClient: HttpClient
              private store: Store<fromApp.AppState>) {}

  storeRecipes() {
    this.store.dispatch(new recipeActions.StoreRecipes());
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