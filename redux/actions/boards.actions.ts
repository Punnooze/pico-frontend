import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
} from "../keys/boards.keys";
import { Board } from "../network/boards.api";

export interface BoardsFetchRequestAction {
  type: typeof BOARDS_FETCH_REQUEST;
  payload: {
    userId: string;
  };
}

export interface BoardsFetchSuccessAction {
  type: typeof BOARDS_FETCH_SUCCESS;
  payload: {
    boards: Board[];
  };
}

export interface BoardsFetchFailureAction {
  type: typeof BOARDS_FETCH_FAILURE;
  payload: {
    error: string;
  };
}

export type BoardsActionTypes =
  | BoardsFetchRequestAction
  | BoardsFetchSuccessAction
  | BoardsFetchFailureAction;

export const boardsFetchRequest = (
  userId: string
): BoardsFetchRequestAction => ({
  type: BOARDS_FETCH_REQUEST,
  payload: { userId },
});

export const boardsFetchSuccess = (
  boards: Board[]
): BoardsFetchSuccessAction => ({
  type: BOARDS_FETCH_SUCCESS,
  payload: { boards },
});

export const boardsFetchFailure = (
  error: string
): BoardsFetchFailureAction => ({
  type: BOARDS_FETCH_FAILURE,
  payload: { error },
});
