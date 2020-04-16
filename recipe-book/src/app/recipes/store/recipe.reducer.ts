import { Recipe } from '../recipe.model';
import * as recipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(state = initialState, action: recipesActions.RecipesAction) {
  switch (action.type) {
    case recipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    default:
      return state;
  }
}