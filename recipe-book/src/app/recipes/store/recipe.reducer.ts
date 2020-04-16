import { Recipe } from '../recipe.model';
import * as recipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

const updatedRecipe = (recipes: Recipe[], index: number, newRecipe: Recipe) => {
  recipes[index] = newRecipe;

  return recipes;
}

export function recipeReducer(state = initialState, action: recipesActions.RecipesAction) {
  switch (action.type) {
    case recipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case recipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case recipesActions.UPDATE_RECIPE:
      return {
        ...state,
        recipes: updatedRecipe(state.recipes.slice(), action.payload.index, action.payload.newRecipe)
      };
    case recipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.payload)
      };
    default:
      return state;
  }
}