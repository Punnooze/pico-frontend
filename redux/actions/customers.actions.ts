import {
  GET_CUSTOMER_DETAILS_FAILURE,
  GET_CUSTOMER_DETAILS_REQUEST,
  GET_CUSTOMER_DETAILS_SUCCESS,
} from "../keys/customers.keys";
import { Customer } from "../network/customers.api";

export interface GetCustomerDetailsRequestAction {
  type: typeof GET_CUSTOMER_DETAILS_REQUEST;
  payload: {
    customerId: string;
  };
}

export interface GetCustomerDetailsSuccessAction {
  type: typeof GET_CUSTOMER_DETAILS_SUCCESS;
  payload: {
    customerDetails: Customer;
  };
}

export interface GetCustomerDetailsFailureAction {
  type: typeof GET_CUSTOMER_DETAILS_FAILURE;
  payload: {
    error: string;
  };
}

export type CustomerActionTypes =
  | GetCustomerDetailsRequestAction
  | GetCustomerDetailsSuccessAction
  | GetCustomerDetailsFailureAction;

export const getCustomerDetailsRequest = (
  customerId: string
): GetCustomerDetailsRequestAction => ({
  type: GET_CUSTOMER_DETAILS_REQUEST,
  payload: { customerId },
});

export const getCustomerDetailsSuccess = (
  customerDetails: Customer
): GetCustomerDetailsSuccessAction => ({
  type: GET_CUSTOMER_DETAILS_SUCCESS,
  payload: { customerDetails },
});

export const getCustomerDetailsFailure = (
  error: string
): GetCustomerDetailsFailureAction => ({
  type: GET_CUSTOMER_DETAILS_FAILURE,
  payload: { error },
});
