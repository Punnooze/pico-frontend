# Redux Tutorial - Complete Guide

Welcome to Redux! This tutorial will teach you Redux through the boards feature we just implemented.

## Table of Contents

1. [What is Redux?](#what-is-redux)
2. [Core Concepts](#core-concepts)
3. [Redux Flow](#redux-flow)
4. [Project Structure](#project-structure)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)
8. [Debugging](#debugging)

---

## What is Redux?

Redux is a **state management library** for JavaScript applications. Think of it as a centralized store for all your application's data.

### Why use Redux?

- **Centralized State**: All data in one place, accessible from any component
- **Predictable**: State changes follow strict rules (actions → reducers)
- **Debuggable**: Time-travel debugging, action logging
- **Testable**: Pure functions make testing easy
- **Scalable**: Works well in large applications

### When to use Redux?

✅ Use Redux when:

- Multiple components need the same data
- State needs to be accessible from anywhere
- Complex state logic
- Need to track state changes (debugging)
- Large-scale application

❌ Don't use Redux when:

- Simple apps with local state
- Data only used in one component
- Just learning React (master React first!)

---

## Core Concepts

### 1. Store

The **single source of truth** for your application state.

```typescript
// Current state
{
  boards: {
    boards: [...],
    loading: false,
    error: null
  }
}
```

### 2. Actions

Plain JavaScript objects that describe **what happened**.

```typescript
// Action object
{
  type: 'BOARDS_FETCH_REQUEST',
  payload: { userId: 'user123' }
}
```

### 3. Action Creators

Functions that **create action objects**.

```typescript
export const boardsFetchRequest = (userId: string) => ({
  type: "BOARDS_FETCH_REQUEST",
  payload: { userId },
});
```

### 4. Reducers

Pure functions that specify **how state changes**.

```typescript
(currentState, action) => newState;
```

### 5. Middleware (Sagas)

Handles **side effects** (API calls, async operations).

```typescript
// Saga intercepts action, calls API, dispatches new action
Action → Saga → API → Success/Failure Action → Reducer → New State
```

---

## Redux Flow

Here's how data flows in Redux:

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ 1. dispatch(action)
       ▼
┌─────────────┐
│   Saga      │ ← Intercepts action
└──────┬──────┘
       │ 2. Calls API
       ▼
┌─────────────┐
│     API     │
└──────┬──────┘
       │ 3. Returns data
       ▼
┌─────────────┐
│   Saga      │ ← Dispatches success/failure
└──────┬──────┘
       │ 4. dispatch(successAction)
       ▼
┌─────────────┐
│   Reducer   │ ← Updates state
└──────┬──────┘
       │ 5. Returns new state
       ▼
┌─────────────┐
│    Store    │ ← Holds new state
└──────┬──────┘
       │ 6. Notifies subscribers
       ▼
┌─────────────┐
│  Component  │ ← Re-renders with new data
└─────────────┘
```

### Example: Fetching Boards

1. **User opens page**

   ```typescript
   // Component
   dispatch(boardsFetchRequest("user123"));
   ```

2. **Saga intercepts action**

   ```typescript
   // boards.saga.ts
   function* fetchBoardsSaga(action) {
     const boards = yield call(getBoardsApi, userId);
     yield put(boardsFetchSuccess(boards));
   }
   ```

3. **API call happens**

   ```typescript
   // boards.api.ts
   const response = await axios.get("/getBoards?userId=user123");
   ```

4. **Saga dispatches success**

   ```typescript
   dispatch(boardsFetchSuccess([...boards]));
   ```

5. **Reducer updates state**

   ```typescript
   // boards.reducer.ts
   case BOARDS_FETCH_SUCCESS:
     return { ...state, boards: action.payload.boards, loading: false };
   ```

6. **Component re-renders**
   ```typescript
   // Component gets new data
   const boards = useAppSelector((state) => state.boards.boards);
   ```

---

## Project Structure

```
redux/
├── actions/              # Action creators
│   └── boards.actions.ts # Board action creators
├── keys/                 # Action type constants
│   └── boards.keys.ts    # Board action types
├── network/              # API calls
│   └── boards.api.ts     # Board API functions
├── reducers/             # State management
│   ├── boards.reducer.ts # Board reducer
│   └── index.ts          # Root reducer (combines all)
├── sagas/                # Side effects
│   ├── boards.saga.ts    # Board saga
│   └── index.ts          # Root saga (combines all)
├── hooks.ts              # Typed Redux hooks
├── provider.tsx          # Redux Provider wrapper
└── store.ts              # Store configuration
```

---

## Step-by-Step Implementation

### Step 1: Define Action Types (Keys)

**File**: `redux/keys/boards.keys.ts`

```typescript
export const BOARDS_FETCH_REQUEST = "BOARDS_FETCH_REQUEST";
export const BOARDS_FETCH_SUCCESS = "BOARDS_FETCH_SUCCESS";
export const BOARDS_FETCH_FAILURE = "BOARDS_FETCH_FAILURE";
```

**Why?** Prevents typos and makes refactoring easier.

---

### Step 2: Create API Functions (Network)

**File**: `redux/network/boards.api.ts`

```typescript
import axios from "axios";

export interface Board {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export const getBoardsApi = async (userId: string): Promise<Board[]> => {
  const response = await axios.get(`/api/getBoards`, {
    params: { userId },
  });
  return response.data;
};
```

**Why?** Centralizes API logic, easy to test and modify.

---

### Step 3: Create Action Creators (Actions)

**File**: `redux/actions/boards.actions.ts`

```typescript
export const boardsFetchRequest = (userId: string) => ({
  type: BOARDS_FETCH_REQUEST,
  payload: { userId },
});

export const boardsFetchSuccess = (boards: Board[]) => ({
  type: BOARDS_FETCH_SUCCESS,
  payload: { boards },
});

export const boardsFetchFailure = (error: string) => ({
  type: BOARDS_FETCH_FAILURE,
  payload: { error },
});
```

**Why?** Creates consistent action objects.

---

### Step 4: Create Reducer

**File**: `redux/reducers/boards.reducer.ts`

```typescript
const initialState = {
  boards: [],
  loading: false,
  error: null,
};

const boardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOARDS_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case BOARDS_FETCH_SUCCESS:
      return { ...state, loading: false, boards: action.payload.boards };

    case BOARDS_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    default:
      return state;
  }
};
```

**Why?** Manages how state changes based on actions.

---

### Step 5: Create Saga

**File**: `redux/sagas/boards.saga.ts`

```typescript
import { call, put, takeLatest } from "redux-saga/effects";

// Worker saga: does the actual work
function* fetchBoardsSaga(action) {
  try {
    const boards = yield call(getBoardsApi, action.payload.userId);
    yield put(boardsFetchSuccess(boards));
  } catch (error) {
    yield put(boardsFetchFailure(error.message));
  }
}

// Watcher saga: watches for actions
function* watchFetchBoards() {
  yield takeLatest(BOARDS_FETCH_REQUEST, fetchBoardsSaga);
}
```

**Why?** Handles async operations and side effects.

---

### Step 6: Configure Store

**File**: `redux/store.ts`

```typescript
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
```

**Why?** Sets up the Redux store with all middleware.

---

### Step 7: Add Provider

**File**: `app/layout.tsx`

```typescript
import ReduxProvider from "@/redux/provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
```

**Why?** Makes the store available to all components.

---

### Step 8: Use in Component

**File**: `app/(dashboard)/boards/page.tsx`

```typescript
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { boardsFetchRequest } from "@/redux/actions/boards.actions";

function Page() {
  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards.boards);
  const loading = useAppSelector((state) => state.boards.loading);

  useEffect(() => {
    dispatch(boardsFetchRequest("user123"));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {boards.map((board) => (
        <div key={board.id}>{board.name}</div>
      ))}
    </div>
  );
}
```

**Why?** Connects component to Redux store.

---

## Common Patterns

### Pattern 1: Async Request States

Every async operation has three states:

```typescript
// Keys
FEATURE_ACTION_REQUEST  // Started
FEATURE_ACTION_SUCCESS  // Succeeded
FEATURE_ACTION_FAILURE  // Failed

// State
{
  data: [],
  loading: false,
  error: null
}
```

### Pattern 2: Optimistic Updates

Update UI immediately, rollback if API fails:

```typescript
case CREATE_BOARD_REQUEST:
  return {
    ...state,
    boards: [...state.boards, action.payload.newBoard]
  };

case CREATE_BOARD_FAILURE:
  return {
    ...state,
    boards: state.boards.filter(b => b.id !== action.payload.boardId)
  };
```

### Pattern 3: Normalized State

Store data by ID for efficient lookups:

```typescript
{
  boards: {
    byId: {
      '1': { id: '1', name: 'Board 1' },
      '2': { id: '2', name: 'Board 2' }
    },
    allIds: ['1', '2']
  }
}
```

---

## Best Practices

### ✅ Do

- **Use TypeScript**: Type safety prevents bugs
- **Keep reducers pure**: No side effects, same input = same output
- **Normalize state**: Store data by ID
- **Use action creators**: Don't create actions manually
- **Split reducers**: One reducer per feature
- **Use selectors**: Encapsulate state access
- **Handle loading/error states**: Better UX
- **Use Redux DevTools**: Essential for debugging

### ❌ Don't

- **Mutate state**: Always return new objects
- **Put functions in actions**: Actions must be serializable
- **Do side effects in reducers**: Use sagas/middleware
- **Store derived data**: Calculate on the fly
- **Over-normalize**: Balance convenience vs. performance
- **Put UI state in Redux**: Use local state when possible

---

## Debugging

### Redux DevTools

Install the browser extension:

- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

Features:

- **Action history**: See every action dispatched
- **State diff**: See what changed
- **Time travel**: Go back to previous states
- **Action replay**: Replay actions
- **State export**: Export/import state

### Common Issues

#### 1. Component not updating

```typescript
// ❌ Wrong: Mutating state
state.boards.push(newBoard);

// ✅ Correct: Return new array
return { ...state, boards: [...state.boards, newBoard] };
```

#### 2. Action not triggering saga

```typescript
// Check saga is running
sagaMiddleware.run(rootSaga);

// Check action type matches
yield takeLatest("BOARDS_FETCH_REQUEST", fetchBoardsSaga);
```

#### 3. State is undefined

```typescript
// Check reducer is added to rootReducer
combineReducers({
  boards: boardsReducer, // Must be included!
});
```

---

## Summary

### Redux in 5 Minutes

1. **Create action types** (keys)
2. **Create action creators** (actions)
3. **Create reducer** (state management)
4. **Create saga** (side effects)
5. **Configure store** (combine everything)
6. **Add provider** (wrap app)
7. **Use in component** (dispatch & select)

### Data Flow

```
Component → dispatch(action) → Saga → API → Saga → dispatch(success) → Reducer → Store → Component
```

### Key Files

- `keys/*.keys.ts` - Action type constants
- `actions/*.actions.ts` - Action creators
- `network/*.api.ts` - API calls
- `reducers/*.reducer.ts` - State management
- `sagas/*.saga.ts` - Side effects
- `store.ts` - Store configuration
- `hooks.ts` - Typed hooks

---

## Next Steps

Now that you understand Redux, try:

1. **Add more actions**: Create, update, delete boards
2. **Add more features**: Users, notifications, etc.
3. **Optimize selectors**: Use `reselect` library
4. **Add persistence**: Save state to localStorage
5. **Add authentication**: Secure API calls
6. **Add caching**: Don't refetch if data exists

---

## Resources

- [Redux Official Docs](https://redux.js.org/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Saga Docs](https://redux-saga.js.org/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

---

**Congratulations!** 🎉 You now understand Redux from action to state! Keep practicing and soon it'll be second nature.
