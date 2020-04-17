import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as recipeActions from '../recipes/store/recipe.actions';
import * as fromRecipe from '../recipes/store/recipe.reducer';
import * as fromApp from '../store/app.reducer';
import { Recipe } from './recipe.model';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map((recipeState: fromRecipe.State) => recipeState.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new recipeActions.FetchRecipes());
          
          return this.actions$.pipe(
            ofType(recipeActions.SET_RECIPES),
            take(1)
          )
        }
        
        return of(recipes);
      })
    )
  }
}