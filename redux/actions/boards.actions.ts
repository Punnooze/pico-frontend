import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
  BOARD_FETCH_BY_ID_REQUEST,
  BOARD_FETCH_BY_ID_SUCCESS,
  BOARD_FETCH_BY_ID_FAILURE,
} from "../keys/boards.keys";
import { Board } from "../network/boards.api";

export interface BoardsFetchRequestAction {
  type: typeof BOARDS_FETCH_REQUEST;
  payload: {};
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

export interface BoardFetchByIdRequestAction {
  type: typeof BOARD_FETCH_BY_ID_REQUEST;
  payload: {
    boardId: string;
  };
}

export interface BoardFetchByIdSuccessAction {
  type: typeof BOARD_FETCH_BY_ID_SUCCESS;
  payload: {
    board: Board;
  };
}

export interface BoardFetchByIdFailureAction {
  type: typeof BOARD_FETCH_BY_ID_FAILURE;
  payload: {
    error: string;
  };
}

export type BoardsActionTypes =
  | BoardsFetchRequestAction
  | BoardsFetchSuccessAction
  | BoardsFetchFailureAction
  | BoardFetchByIdRequestAction
  | BoardFetchByIdSuccessAction
  | BoardFetchByIdFailureAction;

export const boardsFetchRequest = (): BoardsFetchRequestAction => ({
  type: BOARDS_FETCH_REQUEST,
  payload: {},
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

export const boardFetchByIdRequest = (
  boardId: string
): BoardFetchByIdRequestAction => ({
  type: BOARD_FETCH_BY_ID_REQUEST,
  payload: { boardId },
});

export const boardFetchByIdSuccess = (
  board: Board
): BoardFetchByIdSuccessAction => ({
  type: BOARD_FETCH_BY_ID_SUCCESS,
  payload: { board },
});

export const boardFetchByIdFailure = (
  error: string
): BoardFetchByIdFailureAction => ({
  type: BOARD_FETCH_BY_ID_FAILURE,
  payload: { error },
});
