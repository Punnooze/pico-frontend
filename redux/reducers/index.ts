import { combineReducers } from "redux";
import boardsReducer, { BoardsState } from "./boards.reducer";
import customersReducer, { CustomersState } from "./customers.reducer";
import loginReducer from "./login.reducer";

export interface RootState {
  boards: BoardsState;
  customers: CustomersState;
}

const rootReducer = combineReducers({
  boards: boardsReducer,
  customers: customersReducer,
  login: loginReducer
});

export default rootReducer;
