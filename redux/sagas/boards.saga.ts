import { call, put, takeLatest, all } from "redux-saga/effects";
import { getAllBoardsApi, getBoardById, Board } from "../network/boards.api";
import {
  BOARDS_FETCH_REQUEST,
  BOARD_FETCH_BY_ID_REQUEST,
} from "../keys/boards.keys";
import {
  boardsFetchSuccess,
  boardsFetchFailure,
  boardFetchByIdSuccess,
  boardFetchByIdFailure,
  BoardFetchByIdRequestAction,
} from "../actions/boards.actions";

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

function* fetchBoardByIdSaga(action: BoardFetchByIdRequestAction) {
  try {
    const { boardId } = action.payload;
    const board: Board | null = yield call(getBoardById, boardId);
    if (board) {
      yield put(boardFetchByIdSuccess(board));
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

export default function* boardsSaga() {
  yield all([watchFetchBoards(), watchFetchBoardById()]);
}
