import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
} from "../keys/boards.keys";
import { BoardsActionTypes } from "../actions/boards.actions";
import { Board } from "../network/boards.api";

export interface BoardsState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
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

    default:
      return state;
  }
};

export default boardsReducer;
