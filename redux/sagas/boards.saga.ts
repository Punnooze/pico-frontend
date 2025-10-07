import { call, put, takeLatest, all } from "redux-saga/effects";
import { getBoardsApi, Board } from "../network/boards.api";
import { BOARDS_FETCH_REQUEST } from "../keys/boards.keys";
import {
  BoardsFetchRequestAction,
  boardsFetchSuccess,
  boardsFetchFailure,
} from "../actions/boards.actions";

function* fetchBoardsSaga(action: BoardsFetchRequestAction) {
  try {
    const { userId } = action.payload;
    const boards: Board[] = yield call(getBoardsApi, userId);
    yield put(boardsFetchSuccess(boards));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(boardsFetchFailure(errorMessage));
  }
}

function* watchFetchBoards() {
  yield takeLatest(BOARDS_FETCH_REQUEST, fetchBoardsSaga);
}

export default function* boardsSaga() {
  yield all([watchFetchBoards()]);
}
