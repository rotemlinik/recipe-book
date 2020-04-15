import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User
}

const initialState: State = {
  user: null
}

export function authReducer(state: State = initialState, action: AuthActions.AuthAction) {
  switch (action.type) {
    case AuthActions.LOGIN:
      return {
        ...state,
        user: new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate)
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }

  return state; // important because a dispatch call reaches all reducers
}