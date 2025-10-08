import { call, put, takeLatest, all } from "redux-saga/effects";
import Cookies from "js-cookie";
import {
  loginFailure,
  LoginRequestAction,
  loginSuccess,
} from "../actions/login.action";
import { loginApi } from "../network/login.api";
import { LOGIN_REQUEST } from "../keys/login.keys";

function* loginSaga(action: LoginRequestAction) {
  try {
    const email = action.payload.email;
    const password = action.payload.password;
    const token: string = yield call(loginApi, email, password);

    localStorage.setItem("auth-token", token);
    Cookies.set("isAuthenticated", "true");

    yield put(loginSuccess(token));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(loginFailure(errorMessage));
  }
}

function* watchGetCustomerDetails() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}

export default function* customersSaga() {
  yield all([watchGetCustomerDetails()]);
}
