/**
 * REDUX ACTIONS (Action Creators)
 *
 * Actions are plain JavaScript objects that describe what happened in the app.
 * They are the ONLY way to get data into the Redux store.
 *
 * An action must have:
 * - type: A string that identifies the action
 * - payload (optional): Data associated with the action
 *
 * Action Creators are functions that create and return action objects.
 * This makes it easier to dispatch actions and ensures consistency.
 */

import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
} from "../keys/boards.keys";
import { Board } from "../network/boards.api";

/**
 * TypeScript: Define types for each action
 * This helps with type safety when handling actions in reducers
 */

// Action for initiating board fetch
export interface BoardsFetchRequestAction {
  type: typeof BOARDS_FETCH_REQUEST;
  payload: {
    userId: string; // We need userId to fetch the right boards
  };
}

// Action for successful board fetch
export interface BoardsFetchSuccessAction {
  type: typeof BOARDS_FETCH_SUCCESS;
  payload: {
    boards: Board[]; // The boards data from the API
  };
}

// Action for failed board fetch
export interface BoardsFetchFailureAction {
  type: typeof BOARDS_FETCH_FAILURE;
  payload: {
    error: string; // Error message
  };
}

// Union type: An action can be any of these three types
export type BoardsActionTypes =
  | BoardsFetchRequestAction
  | BoardsFetchSuccessAction
  | BoardsFetchFailureAction;

/**
 * ACTION CREATORS
 * These functions create action objects
 */

/**
 * Action creator for fetching boards
 * This is what you'll call from your React component
 *
 * Usage: dispatch(boardsFetchRequest('user123'))
 */
export const boardsFetchRequest = (
  userId: string
): BoardsFetchRequestAction => ({
  type: BOARDS_FETCH_REQUEST,
  payload: { userId },
});

/**
 * Action creator for successful fetch
 * Called by the saga after API call succeeds
 */
export const boardsFetchSuccess = (
  boards: Board[]
): BoardsFetchSuccessAction => ({
  type: BOARDS_FETCH_SUCCESS,
  payload: { boards },
});

/**
 * Action creator for failed fetch
 * Called by the saga after API call fails
 */
export const boardsFetchFailure = (
  error: string
): BoardsFetchFailureAction => ({
  type: BOARDS_FETCH_FAILURE,
  payload: { error },
});
