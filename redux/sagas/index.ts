import { all } from "redux-saga/effects";
import boardsSaga from "./boards.saga";
import customersSaga from "./customers.saga";
import loginSaga from "./login.saga";

export default function* rootSaga() {
  yield all([boardsSaga(), customersSaga(), loginSaga()]);
}
