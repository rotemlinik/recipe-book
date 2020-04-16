import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;

}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false
}

export function authReducer(state: State = initialState, action: AuthActions.AuthAction) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate),
        authError: null,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      }
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      }
    default:
      return state;
  }

  return state; // important because a dispatch call reaches all reducers
}