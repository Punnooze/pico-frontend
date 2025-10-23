import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
  BOARD_FETCH_BY_ID_REQUEST,
  BOARD_FETCH_BY_ID_SUCCESS,
  BOARD_FETCH_BY_ID_FAILURE,
  MOVE_TASK_OPTIMISTIC,
  MOVE_TASK_SUCCESS,
  MOVE_TASK_FAILURE,
} from "../keys/boards.keys";
import { BoardsActionTypes } from "../actions/boards.actions";
import { Board } from "../network/boards.api";
import { Task } from "@/components/UnassignedTasks";

export interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  currentTasksByCategory: Record<string, Task[]> | null;
  optimisticUpdates: string[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  currentTasksByCategory: null,
  optimisticUpdates: [],
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
        currentTasksByCategory: action.payload.tasksByCategory || null,
        error: null,
      };

    case BOARD_FETCH_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case MOVE_TASK_OPTIMISTIC:
      // Update UI immediately with optimistic data
      return {
        ...state,
        currentTasksByCategory: action.payload.updatedTasksByCategory,
        optimisticUpdates: [...state.optimisticUpdates, action.payload.taskId],
      };

    case MOVE_TASK_SUCCESS:
      // API succeeded, just remove optimistic flag
      return {
        ...state,
        optimisticUpdates: state.optimisticUpdates.filter(
          (id) => id !== action.payload.optimisticId
        ),
      };

    case MOVE_TASK_FAILURE:
      // API failed, rollback to snapshot
      return {
        ...state,
        currentTasksByCategory: action.payload.snapshot,
        optimisticUpdates: state.optimisticUpdates.filter(
          (id) => id !== action.payload.optimisticId
        ),
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export default boardsReducer;
