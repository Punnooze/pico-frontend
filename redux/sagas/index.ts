/**
 * ROOT SAGA
 *
 * Similar to the root reducer, we need a root saga that runs all sagas.
 * The all() effect runs multiple sagas in parallel.
 *
 * Each saga runs independently and listens for its own actions.
 */

import { all } from "redux-saga/effects";
import boardsSaga from "./boards.saga";

/**
 * Root saga that combines all feature sagas
 * Add new sagas here as you build more features
 */
export default function* rootSaga() {
  yield all([
    boardsSaga(),
    // Add more sagas here:
    // userSaga(),
    // notificationsSaga(),
  ]);
}
