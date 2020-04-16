import { Actions, Effect, ofType } from '@ngrx/effects';
import * as recipeActions from './recipe.actions';
import * as fromApp from './recipe.reducer';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { switchMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

const addIngredientsArrayIfMissing = (recipes: Recipe[]) => {
  recipes.forEach(recipe => {
    if (!recipe.ingredients) {
      recipe.ingredients = [];
    }
  })

  return recipes;
}

@Injectable()
export class RecipeEffects {
  recipeBookBackendUrl = 'https://recipe-book-backend-9f161.firebaseio.com/recipes.json';

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(recipeActions.FETCH_RECIPES),
    switchMap(() => this.httpClient.get<Recipe[]>(this.recipeBookBackendUrl)),
    map(recipes => new recipeActions.SetRecipes(addIngredientsArrayIfMissing(recipes)))
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(recipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => this.httpClient.put(this.recipeBookBackendUrl, recipesState))
  )

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromApp.State>) {}
}