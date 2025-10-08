import { LoginActionTypes } from "../actions/login.action";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from "../keys/login.keys";

export interface LoginState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: LoginState = {
  token: null,
  loading: false,
  error: null,
};

const loginReducer = (
  state: LoginState = initialState,
  action: LoginActionTypes
): LoginState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};
export default loginReducer;
