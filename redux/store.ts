/**
 * REDUX STORE CONFIGURATION
 *
 * The Store is the heart of Redux. It:
 * 1. Holds the application state
 * 2. Allows access to state via getState()
 * 3. Allows state updates via dispatch(action)
 * 4. Registers listeners via subscribe(listener)
 *
 * We configure the store with:
 * - Root reducer: Defines how state changes
 * - Middleware: Extends Redux with custom functionality (sagas, logging, etc.)
 * - Initial state: Starting state (optional)
 */

import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

/**
 * Create the saga middleware
 * Middleware is a way to extend Redux with custom behavior
 * Saga middleware allows us to run sagas (handle side effects)
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * Configure the Redux store
 *
 * configureStore() is from Redux Toolkit and:
 * - Sets up Redux DevTools automatically
 * - Adds default middleware (thunk, etc.)
 * - Enables development checks
 *
 * Parameters:
 * - reducer: The root reducer
 * - middleware: Custom middleware (we add saga middleware)
 */
const store = configureStore({
  reducer: rootReducer,

  /**
   * Add saga middleware
   * getDefaultMiddleware() returns Redux Toolkit's default middleware
   * We append our saga middleware to it
   *
   * serializableCheck: false - Disables warnings about non-serializable values
   * (saga middleware requires this)
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

/**
 * Run the root saga
 * This starts all watcher sagas
 * They will now listen for actions and trigger worker sagas
 */
sagaMiddleware.run(rootSaga);

/**
 * Export types for use in components
 * These provide type safety when using Redux hooks
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
