import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from "../keys/login.keys";

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  payload: {
    email: string;
    password: string;
  };
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: {
    token: string;
  };
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: {
    error: string;
  };
}

export type LoginActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction;

export const loginRequest = (
  email: string,
  password: string
): LoginRequestAction => ({
  type: LOGIN_REQUEST,
  payload: {
    email,
    password,
  },
});

export const loginSuccess = (token: string): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: {
    token,
  },
});

export const loginFailure = (error: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload: {
    error,
  },
});
