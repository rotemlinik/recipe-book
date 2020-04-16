import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as recipeActions from '../recipes/store/recipe.actions';
import * as fromRecipe from '../recipes/store/recipe.reducer';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService,
              private store: Store<fromApp.AppState>,
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