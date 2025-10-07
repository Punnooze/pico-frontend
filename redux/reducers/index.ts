/**
 * ROOT REDUCER
 *
 * In a real application, you'll have multiple reducers for different features:
 * - boardsReducer: Manages boards data
 * - userReducer: Manages user data
 * - notificationsReducer: Manages notifications
 * - etc.
 *
 * combineReducers() combines all these reducers into a single reducer function.
 * Each reducer manages its own slice of the state tree.
 *
 * The resulting state will look like:
 * {
 *   boards: { boards: [], loading: false, error: null },
 *   user: { ... },
 *   notifications: { ... }
 * }
 */

import { combineReducers } from "redux";
import boardsReducer, { BoardsState } from "./boards.reducer";

/**
 * RootState interface
 * Defines the shape of the entire Redux state tree
 * This is used throughout the app for type safety
 */
export interface RootState {
  boards: BoardsState;
  // Add more state slices as you add more reducers:
  // user: UserState;
  // notifications: NotificationsState;
}

/**
 * Combine all reducers
 * The key becomes the property name in the state object
 */
const rootReducer = combineReducers({
  boards: boardsReducer,
  // Add more reducers here:
  // user: userReducer,
  // notifications: notificationsReducer,
});

export default rootReducer;
