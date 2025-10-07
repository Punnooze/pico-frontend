import { combineReducers } from "redux";
import boardsReducer, { BoardsState } from "./boards.reducer";

export interface RootState {
  boards: BoardsState;
}

const rootReducer = combineReducers({
  boards: boardsReducer,
});

export default rootReducer;
