import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
  BOARD_FETCH_BY_ID_REQUEST,
  BOARD_FETCH_BY_ID_SUCCESS,
  BOARD_FETCH_BY_ID_FAILURE,
} from "../keys/boards.keys";
import { BoardsActionTypes } from "../actions/boards.actions";
import { Board } from "../network/boards.api";

export interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

const boardsReducer = (
  state: BoardsState = initialState,
  action: BoardsActionTypes
): BoardsState => {
  switch (action.type) {
    case BOARDS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BOARDS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        boards: action.payload.boards,
        error: null,
      };

    case BOARDS_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case BOARD_FETCH_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BOARD_FETCH_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentBoard: action.payload.board,
        error: null,
      };

    case BOARD_FETCH_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export default boardsReducer;
