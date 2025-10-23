import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
  BOARD_FETCH_BY_ID_REQUEST,
  BOARD_FETCH_BY_ID_SUCCESS,
  BOARD_FETCH_BY_ID_FAILURE,
  MOVE_TASK_OPTIMISTIC,
  MOVE_TASK_REQUEST,
  MOVE_TASK_SUCCESS,
  MOVE_TASK_FAILURE,
} from "../keys/boards.keys";
import { Board } from "../network/boards.api";
import { Task } from "@/components/UnassignedTasks";

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
    tasksByCategory?: Record<string, Task[]>;
  };
}

export interface BoardFetchByIdFailureAction {
  type: typeof BOARD_FETCH_BY_ID_FAILURE;
  payload: {
    error: string;
  };
}

// Move task actions
export interface MoveTaskOptimisticAction {
  type: typeof MOVE_TASK_OPTIMISTIC;
  payload: {
    taskId: string;
    oldCategoryId: string;
    newCategoryId: string;
    newCategoryName: string;
    updatedTasksByCategory: Record<string, Task[]>;
  };
}

export interface MoveTaskRequestAction {
  type: typeof MOVE_TASK_REQUEST;
  payload: {
    optimisticId: string;
    taskId: string;
    boardId: string;
    oldCategoryId: string;
    newCategoryId: string;
    newCategoryName: string;
    snapshot: Record<string, Task[]>;
  };
}

export interface MoveTaskSuccessAction {
  type: typeof MOVE_TASK_SUCCESS;
  payload: {
    optimisticId: string;
  };
}

export interface MoveTaskFailureAction {
  type: typeof MOVE_TASK_FAILURE;
  payload: {
    optimisticId: string;
    error: string;
    snapshot: Record<string, Task[]>;
  };
}

export type BoardsActionTypes =
  | BoardsFetchRequestAction
  | BoardsFetchSuccessAction
  | BoardsFetchFailureAction
  | BoardFetchByIdRequestAction
  | BoardFetchByIdSuccessAction
  | BoardFetchByIdFailureAction
  | MoveTaskOptimisticAction
  | MoveTaskRequestAction
  | MoveTaskSuccessAction
  | MoveTaskFailureAction;

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

export const boardFetchByIdSuccess = (payload: {
  board: Board;
  tasksByCategory?: Record<string, Task[]>;
}): BoardFetchByIdSuccessAction => ({
  type: BOARD_FETCH_BY_ID_SUCCESS,
  payload,
});

export const boardFetchByIdFailure = (
  error: string
): BoardFetchByIdFailureAction => ({
  type: BOARD_FETCH_BY_ID_FAILURE,
  payload: { error },
});

// Move task action creators
export const moveTaskOptimistic = (
  taskId: string,
  oldCategoryId: string,
  newCategoryId: string,
  newCategoryName: string,
  updatedTasksByCategory: Record<string, Task[]>
): MoveTaskOptimisticAction => ({
  type: MOVE_TASK_OPTIMISTIC,
  payload: {
    taskId,
    oldCategoryId,
    newCategoryId,
    newCategoryName,
    updatedTasksByCategory,
  },
});

export const moveTaskRequest = (
  optimisticId: string,
  taskId: string,
  boardId: string,
  oldCategoryId: string,
  newCategoryId: string,
  newCategoryName: string,
  snapshot: Record<string, Task[]>
): MoveTaskRequestAction => ({
  type: MOVE_TASK_REQUEST,
  payload: {
    optimisticId,
    taskId,
    boardId,
    oldCategoryId,
    newCategoryId,
    newCategoryName,
    snapshot,
  },
});

export const moveTaskSuccess = (
  optimisticId: string
): MoveTaskSuccessAction => ({
  type: MOVE_TASK_SUCCESS,
  payload: { optimisticId },
});

export const moveTaskFailure = (
  optimisticId: string,
  error: string,
  snapshot: Record<string, Task[]>
): MoveTaskFailureAction => ({
  type: MOVE_TASK_FAILURE,
  payload: { optimisticId, error, snapshot },
});
