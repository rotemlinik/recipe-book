import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

// this is a JS object, not TS, that's why it is a bit different
const initialState = {
  ingredients: [
    new Ingredient("tomatoes", 3),
    new Ingredient("minced beef", 1)
  ]
}

// "state = initialState" ts/ js nex gen syntax for default value
export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state, // copy the initial state first, since it is immutable. good practice for when state has more than just one object
        ingredients: [...state.ingredients, action.payload]
      };
    default:
      return state;
  }
}