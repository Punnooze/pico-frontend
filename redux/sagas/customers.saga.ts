import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  getCustomerDetailsFailure,
  GetCustomerDetailsRequestAction,
  getCustomerDetailsSuccess,
} from "../actions/customers.actions";
import { Customer, getCustomerDetailsApi } from "../network/customers.api";
import { GET_CUSTOMER_DETAILS_REQUEST } from "../keys/customers.keys";

function* getCustomerDetailsSaga(action: GetCustomerDetailsRequestAction) {
  try {
    const { customerId } = action.payload;
    const customerDetails: Customer = yield call(
      getCustomerDetailsApi,
      customerId
    );

    yield put(getCustomerDetailsSuccess(customerDetails));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(getCustomerDetailsFailure(errorMessage));
  }
}

function* watchGetCustomerDetails() {
  yield takeLatest(GET_CUSTOMER_DETAILS_REQUEST, getCustomerDetailsSaga);
}

export default function* customersSaga() {
  yield all([watchGetCustomerDetails()]);
}
