/**
 * REDUX SAGA
 *
 * Sagas are used for handling SIDE EFFECTS in Redux (async operations, API calls, etc.)
 * They are middleware that sit between action dispatch and the reducer.
 *
 * Think of sagas as separate threads that:
 * 1. Listen for specific actions
 * 2. Perform side effects (API calls, etc.)
 * 3. Dispatch new actions based on results
 *
 * Sagas use ES6 generator functions (function*)
 * Generators can pause execution and resume later, perfect for async operations
 *
 * KEY CONCEPTS:
 * - yield: Pauses the function and waits for a result
 * - put: Dispatches an action (like dispatch in React)
 * - call: Calls a function (like async/await but for generators)
 * - takeLatest: Listens for actions, cancels previous if new one comes
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { getBoardsApi, Board } from "../network/boards.api";
import { BOARDS_FETCH_REQUEST } from "../keys/boards.keys";
import {
  BoardsFetchRequestAction,
  boardsFetchSuccess,
  boardsFetchFailure,
} from "../actions/boards.actions";

/**
 * WORKER SAGA
 * This saga handles the actual work of fetching boards
 *
 * @param action - The action that triggered this saga
 *
 * Generator function steps:
 * 1. Extract userId from action
 * 2. Call the API (yields and waits for response)
 * 3. If successful, dispatch success action with data
 * 4. If failed, dispatch failure action with error
 */
function* fetchBoardsSaga(action: BoardsFetchRequestAction) {
  try {
    // Extract userId from the action payload
    const { userId } = action.payload;

    /**
     * call() effect:
     * - Calls the getBoardsApi function with userId parameter
     * - Waits for the Promise to resolve
     * - Returns the result (array of boards)
     *
     * Why use call() instead of just calling getBoardsApi()?
     * - Makes the saga testable (you can mock the API call)
     * - Redux-saga can manage the async flow better
     */
    const boards: Board[] = yield call(getBoardsApi, userId);

    /**
     * put() effect:
     * - Dispatches an action to the Redux store
     * - Similar to dispatch() in React components
     * - The reducer will handle this action and update state
     */
    yield put(boardsFetchSuccess(boards));
  } catch (error) {
    /**
     * If API call fails, dispatch failure action
     * The reducer will store the error in state
     */
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(boardsFetchFailure(errorMessage));
  }
}

/**
 * WATCHER SAGA
 * This saga watches for specific actions and triggers worker sagas
 *
 * takeLatest():
 * - Listens for BOARDS_FETCH_REQUEST actions
 * - When detected, runs fetchBoardsSaga
 * - If a new BOARDS_FETCH_REQUEST comes before the previous completes,
 *   it CANCELS the previous saga and starts a new one
 *
 * Alternatives:
 * - takeEvery: Runs a new saga for every action (doesn't cancel previous)
 * - takeLeading: Only runs if no saga is currently running
 */
function* watchFetchBoards() {
  yield takeLatest(BOARDS_FETCH_REQUEST, fetchBoardsSaga);
}

/**
 * ROOT SAGA
 * Combines all board-related sagas
 * This is what we'll import into the main saga file
 *
 * The all() effect runs multiple sagas concurrently
 */
import { all } from "redux-saga/effects";

export default function* boardsSaga() {
  yield all([
    watchFetchBoards(),
    // Add more watchers here as you add more features
    // e.g., watchCreateBoard(), watchDeleteBoard(), etc.
  ]);
}
