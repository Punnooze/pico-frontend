import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  getAllBoardsApi,
  getBoardById,
  Board,
  moveTaskApi,
} from "../network/boards.api";
import {
  BOARDS_FETCH_REQUEST,
  BOARD_FETCH_BY_ID_REQUEST,
  MOVE_TASK_REQUEST,
} from "../keys/boards.keys";
import {
  boardsFetchSuccess,
  boardsFetchFailure,
  boardFetchByIdSuccess,
  boardFetchByIdFailure,
  BoardFetchByIdRequestAction,
  moveTaskSuccess,
  moveTaskFailure,
  MoveTaskRequestAction,
} from "../actions/boards.actions";
import { toast } from "sonner";

function* fetchBoardsSaga() {
  try {
    const boards: Board[] = yield call(getAllBoardsApi);
    yield put(boardsFetchSuccess(boards));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(boardsFetchFailure(errorMessage));
  }
}

function* fetchBoardByIdSaga(
  action: BoardFetchByIdRequestAction
): Generator<any, void, any> {
  try {
    const { boardId } = action.payload;
    const response = yield call(getBoardById, boardId);

    if (response && response.board) {
      // Response is in format: { board: {...}, tasksByCategory: {...} }
      yield put(boardFetchByIdSuccess(response));
    } else {
      yield put(boardFetchByIdFailure("Board not found"));
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(boardFetchByIdFailure(errorMessage));
  }
}

function* watchFetchBoards() {
  yield takeLatest(BOARDS_FETCH_REQUEST, fetchBoardsSaga);
}

function* watchFetchBoardById() {
  yield takeLatest(BOARD_FETCH_BY_ID_REQUEST, fetchBoardByIdSaga);
}

function* moveTaskSaga(action: MoveTaskRequestAction) {
  try {
    const {
      optimisticId,
      taskId,
      boardId,
      oldCategoryId,
      newCategoryId,
      newCategoryName,
    } = action.payload;

    // Call API to move task
    yield call(moveTaskApi, {
      taskId,
      boardId,
      oldCategoryId,
      newCategoryId,
      newCategoryName,
    });

    // Success! UI already updated optimistically
    yield put(moveTaskSuccess(optimisticId));

    // Show success toast
    toast.success("Task moved successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to move task";

    // Rollback: Restore UI to previous state
    yield put(
      moveTaskFailure(
        action.payload.optimisticId,
        errorMessage,
        action.payload.snapshot
      )
    );

    // Show error toast
    toast.error(`Failed to move task: ${errorMessage}`);
  }
}

function* watchMoveTask() {
  yield takeLatest(MOVE_TASK_REQUEST, moveTaskSaga);
}

export default function* boardsSaga() {
  yield all([watchFetchBoards(), watchFetchBoardById(), watchMoveTask()]);
}
