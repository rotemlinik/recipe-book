import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('minced beef', 1), new Ingredient('tomatoes', 3)],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListAction) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: addIngredientToList(state.ingredients.slice(), action.payload)
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      return {
        ...state,
        ingredients: updatedIngredient(state.ingredients.slice(), state.editedIngredientIndex, action.payload),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedIngredientIndex;
        }),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}

function addIngredientToList(ingredients: Ingredient[], newIngredient: Ingredient) {
  const existingIngredientIndex = ingredients.findIndex(itemInList => itemInList.name === newIngredient.name);

  if (existingIngredientIndex > -1) {
    const existingIngredient = ingredients[existingIngredientIndex];
    ingredients[existingIngredientIndex] = new Ingredient(
      existingIngredient.name, existingIngredient.amount + newIngredient.amount);
  } else {
    ingredients.push(newIngredient);
  }

  return ingredients;
}

function updatedIngredient(ingredients: Ingredient[], index: number, newIngredient: Ingredient) {
  const oldIngredient = ingredients[index];
  ingredients[index] = {
    ...oldIngredient,
    ...newIngredient
  };

  return ingredients;
}