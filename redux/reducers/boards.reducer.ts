/**
 * REDUX REDUCER
 *
 * A reducer is a pure function that:
 * 1. Takes the current state and an action as arguments
 * 2. Returns a NEW state (never mutates the existing state)
 *
 * Think of it as: (previousState, action) => newState
 *
 * Reducers specify HOW the application's state changes in response to actions.
 * They are called "reducers" because they reduce a collection of actions into a single state.
 *
 * IMPORTANT RULES:
 * - NEVER mutate state directly
 * - Always return a new object if state changes
 * - Must be pure functions (same input = same output, no side effects)
 */

import {
  BOARDS_FETCH_REQUEST,
  BOARDS_FETCH_SUCCESS,
  BOARDS_FETCH_FAILURE,
} from "../keys/boards.keys";
import { BoardsActionTypes } from "../actions/boards.actions";
import { Board } from "../network/boards.api";

/**
 * STATE SHAPE
 * Define what data this reducer manages
 */
export interface BoardsState {
  boards: Board[]; // Array of board objects
  loading: boolean; // Is data being fetched?
  error: string | null; // Error message if fetch failed
}

/**
 * INITIAL STATE
 * The state before any actions are dispatched
 * This is what the store looks like when the app first loads
 */
const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
};

/**
 * REDUCER FUNCTION
 *
 * The reducer handles different action types using a switch statement
 * For each action type, it returns a new state object
 */
const boardsReducer = (
  state: BoardsState = initialState, // Default to initialState if state is undefined
  action: BoardsActionTypes // The action that was dispatched
): BoardsState => {
  switch (action.type) {
    /**
     * When fetch request starts:
     * - Set loading to true (show loading spinner)
     * - Clear any previous errors
     * - Keep existing boards (optional: you could clear them)
     */
    case BOARDS_FETCH_REQUEST:
      return {
        ...state, // Spread operator: copy all existing state
        loading: true, // Override loading
        error: null, // Override error
      };

    /**
     * When fetch succeeds:
     * - Set loading to false (hide loading spinner)
     * - Store the boards data
     * - Clear any errors
     */
    case BOARDS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        boards: action.payload.boards, // Update boards with API data
        error: null,
      };

    /**
     * When fetch fails:
     * - Set loading to false
     * - Store the error message
     * - Keep existing boards (or you could clear them)
     */
    case BOARDS_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    /**
     * Default case: if action type doesn't match, return current state unchanged
     * This is important! If we don't handle an action, state shouldn't change
     */
    default:
      return state;
  }
};

export default boardsReducer;
