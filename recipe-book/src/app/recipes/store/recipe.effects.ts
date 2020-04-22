import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Recipe } from '../recipe.model';
import * as recipeActions from './recipe.actions';
import * as fromApp from './recipe.reducer';
import { Ingredient } from 'src/app/shared/ingredient.model';

/* interface RecipeDBQuery {
  id: string {
    name: string,
    description: string,
    imagePath: string,
    ingredients: Ingredient[]
  }
} */

const addIngredientsArrayIfMissing = (recipes: Recipe[]) => {
  recipes.forEach(recipe => {
    if (!recipe.ingredients) {
      recipe.ingredients = [];
    }
  })

  return recipes;
}

const URL_SUFFIX = '.json';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(recipeActions.FETCH_RECIPES),
    switchMap(() => {
      const recipes = this.httpClient.get<Recipe[]>(environment.backendUrl + URL_SUFFIX)
      console.log(recipes);
      return recipes;
    }),
    map(recipes => {
      return new recipeActions.SetRecipes(addIngredientsArrayIfMissing(recipes))
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(recipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => this.httpClient.put(environment.backendUrl + URL_SUFFIX, recipesState))
  )

  @Effect()
  updateRecipe = this.actions$.pipe(
    ofType(recipeActions.UPDATE_RECIPE),
    switchMap((updateRecipeAction : recipeActions.UpdateRecipe) => {
      return this.httpClient.patch(
        environment.backendUrl + '/' + updateRecipeAction.payload.index + '/' + URL_SUFFIX,
        updateRecipeAction.payload.newRecipe
      )
    }),
    map(() => new recipeActions.FetchRecipes())
  )

  @Effect()
  deleteRecipe = this.actions$.pipe(
    ofType(recipeActions.DELETE_RECIPE),
    switchMap((deleteRecipeAction : recipeActions.DeleteRecipe) =>
      this.httpClient.delete(environment.backendUrl + '/' + deleteRecipeAction.payload + '/' + URL_SUFFIX)
    ),
    map(() => new recipeActions.FetchRecipes())
  )

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromApp.State>) {}
}
