/**
 * REDUX KEYS (Action Types)
 *
 * In Redux, "keys" or "action types" are string constants that identify what kind
 * of action is being dispatched. They help us avoid typos and make our code more maintainable.
 *
 * Convention: Use SCREAMING_SNAKE_CASE for action types
 * Pattern: FEATURE_ACTION_STATUS (e.g., BOARDS_FETCH_REQUEST)
 *
 * For async operations, we typically have three action types:
 * 1. REQUEST - Triggered when we START an async operation (like an API call)
 * 2. SUCCESS - Triggered when the operation SUCCEEDS
 * 3. FAILURE - Triggered when the operation FAILS
 */

// Action types for fetching boards
export const BOARDS_FETCH_REQUEST = "BOARDS_FETCH_REQUEST"; // User initiates the fetch
export const BOARDS_FETCH_SUCCESS = "BOARDS_FETCH_SUCCESS"; // API call succeeded
export const BOARDS_FETCH_FAILURE = "BOARDS_FETCH_FAILURE"; // API call failed

// Action types for creating a board (example for future implementation)
export const BOARDS_CREATE_REQUEST = "BOARDS_CREATE_REQUEST";
export const BOARDS_CREATE_SUCCESS = "BOARDS_CREATE_SUCCESS";
export const BOARDS_CREATE_FAILURE = "BOARDS_CREATE_FAILURE";
