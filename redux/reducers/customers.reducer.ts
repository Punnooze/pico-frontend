import { CustomerActionTypes } from "../actions/customers.actions";
import { GET_CUSTOMER_DETAILS_FAILURE, GET_CUSTOMER_DETAILS_REQUEST, GET_CUSTOMER_DETAILS_SUCCESS } from "../keys/customers.keys";
import { Customer } from "../network/customers.api";

export interface CustomersState {
  customerDetails: Customer | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CustomersState = {
  customerDetails: null,
  loading: false,
  error: null,
};

const customersReducer = (
  state: CustomersState = initialState,
  action: CustomerActionTypes
): CustomersState => {
  switch (action.type) {
    case GET_CUSTOMER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        customerDetails: action.payload.customerDetails,
        error: null,
      };
    case GET_CUSTOMER_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
    }
};

export default customersReducer;