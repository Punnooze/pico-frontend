import { all } from "redux-saga/effects";
import boardsSaga from "./boards.saga";

export default function* rootSaga() {
  yield all([boardsSaga()]);
}
