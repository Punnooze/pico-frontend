# Redux Quick Reference

A cheat sheet for working with Redux in this project.

---

## 📁 File Structure

```
redux/
├── actions/          → boardsFetchRequest(), boardsFetchSuccess(), boardsFetchFailure()
├── keys/             → BOARDS_FETCH_REQUEST, BOARDS_FETCH_SUCCESS, BOARDS_FETCH_FAILURE
├── network/          → getBoardsApi(userId) - Makes HTTP calls
├── reducers/         → Updates state based on actions
├── sagas/            → Handles async operations (API calls)
├── hooks.ts          → useAppDispatch(), useAppSelector()
├── provider.tsx      → <ReduxProvider> wrapper
└── store.ts          → Creates and configures store
```

---

## 🚀 Quick Start - Adding a New Feature

### Example: Adding "Delete Board" functionality

#### 1. Add Action Types (keys)

```typescript
// redux/keys/boards.keys.ts
export const BOARDS_DELETE_REQUEST = "BOARDS_DELETE_REQUEST";
export const BOARDS_DELETE_SUCCESS = "BOARDS_DELETE_SUCCESS";
export const BOARDS_DELETE_FAILURE = "BOARDS_DELETE_FAILURE";
```

#### 2. Create API Function (network)

```typescript
// redux/network/boards.api.ts
export const deleteBoardApi = async (boardId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/boards/${boardId}`);
};
```

#### 3. Create Action Creators (actions)

```typescript
// redux/actions/boards.actions.ts
export const boardsDeleteRequest = (boardId: string) => ({
  type: BOARDS_DELETE_REQUEST,
  payload: { boardId },
});

export const boardsDeleteSuccess = (boardId: string) => ({
  type: BOARDS_DELETE_SUCCESS,
  payload: { boardId },
});

export const boardsDeleteFailure = (error: string) => ({
  type: BOARDS_DELETE_FAILURE,
  payload: { error },
});
```

#### 4. Add Saga Worker & Watcher

```typescript
// redux/sagas/boards.saga.ts
function* deleteBoardSaga(action) {
  try {
    const { boardId } = action.payload;
    yield call(deleteBoardApi, boardId);
    yield put(boardsDeleteSuccess(boardId));
  } catch (error) {
    yield put(boardsDeleteFailure(error.message));
  }
}

function* watchDeleteBoard() {
  yield takeLatest(BOARDS_DELETE_REQUEST, deleteBoardSaga);
}

// Add to root saga
export default function* boardsSaga() {
  yield all([
    watchFetchBoards(),
    watchDeleteBoard(), // ← Add this
  ]);
}
```

#### 5. Update Reducer

```typescript
// redux/reducers/boards.reducer.ts
case BOARDS_DELETE_SUCCESS:
  return {
    ...state,
    boards: state.boards.filter(b => b.id !== action.payload.boardId),
    error: null,
  };
```

#### 6. Use in Component

```typescript
// In your component
const dispatch = useAppDispatch();

const handleDelete = (boardId: string) => {
  dispatch(boardsDeleteRequest(boardId));
};

<button onClick={() => handleDelete(board.id)}>Delete</button>;
```

---

## 🎯 Common Patterns

### Reading from Store

```typescript
// Get single value
const boards = useAppSelector((state) => state.boards.boards);

// Get multiple values
const { boards, loading, error } = useAppSelector((state) => state.boards);

// Derived/computed value
const boardCount = useAppSelector((state) => state.boards.boards.length);
const hasBoards = useAppSelector((state) => state.boards.boards.length > 0);
```

### Dispatching Actions

```typescript
// Simple dispatch
dispatch(boardsFetchRequest(userId));

// Dispatch with button click
<button onClick={() => dispatch(boardsDeleteRequest(boardId))}>Delete</button>;

// Dispatch with form submission
const handleSubmit = (formData) => {
  dispatch(boardsCreateRequest(formData));
};
```

### Loading States

```typescript
// Basic loading
{
  loading && <div>Loading...</div>;
}
{
  !loading && <div>Content</div>;
}

// Loading with spinner
{
  loading ? <Spinner /> : <Content data={boards} />;
}

// Inline loading
<button disabled={loading}>{loading ? "Saving..." : "Save"}</button>;
```

### Error Handling

```typescript
// Show error message
{
  error && <div className="error">Error: {error}</div>;
}

// Error with retry
{
  error && (
    <div>
      <p>Error: {error}</p>
      <button onClick={() => dispatch(boardsFetchRequest(userId))}>
        Retry
      </button>
    </div>
  );
}
```

---

## 🔧 Saga Effects Cheat Sheet

```typescript
import {
  call,
  put,
  takeLatest,
  takeEvery,
  all,
  select,
} from "redux-saga/effects";

// call - Call a function (usually API)
const result = yield call(apiFunction, arg1, arg2);

// put - Dispatch an action
yield put(actionCreator(data));

// select - Get data from store
const boards = yield select((state) => state.boards.boards);

// takeLatest - Cancel previous, run latest
yield takeLatest(ACTION_TYPE, workerSaga);

// takeEvery - Run all, don't cancel
yield takeEvery(ACTION_TYPE, workerSaga);

// all - Run multiple sagas in parallel
yield all([saga1(), saga2(), saga3()]);
```

---

## 📋 State Shape Reference

```typescript
// Current Redux State Structure
{
  boards: {
    boards: Board[],        // Array of board objects
    loading: boolean,       // Is API call in progress?
    error: string | null    // Error message if failed
  }
  // Add more slices as you add features:
  // user: { ... },
  // notifications: { ... }
}

// Board Interface
interface Board {
  id: string;
  name: string;
  color: string;
  userId: string;
  starred: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🐛 Debugging Checklist

### Action not triggering saga?

```typescript
// ✅ Check: Action type matches in saga
yield takeLatest(BOARDS_FETCH_REQUEST, fetchBoardsSaga);
//                └─ Must match action.type

// ✅ Check: Saga is added to root saga
export default function* rootSaga() {
  yield all([
    boardsSaga(), // ← Must be here!
  ]);
}

// ✅ Check: Saga middleware is running
sagaMiddleware.run(rootSaga); // In store.ts
```

### State not updating?

```typescript
// ❌ WRONG: Mutating state
state.boards.push(newBoard);

// ✅ CORRECT: Return new state
return { ...state, boards: [...state.boards, newBoard] };

// ✅ Check: Reducer is in combineReducers
const rootReducer = combineReducers({
  boards: boardsReducer, // ← Must be here!
});
```

### Component not re-rendering?

```typescript
// ✅ Check: Using correct selector
const boards = useAppSelector((state) => state.boards.boards);
//                                             └─ matches combineReducers key

// ✅ Check: Component is inside Provider
// In app/layout.tsx:
<ReduxProvider>{children} // ← Your component must be here</ReduxProvider>;
```

### API call failing?

```typescript
// ✅ Check: API URL is correct
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ✅ Check: Backend is running
// Terminal: curl http://localhost:3001/api/getBoards?userId=user123

// ✅ Check: Error handling in saga
try {
  const boards = yield call(getBoardsApi, userId);
  yield put(boardsFetchSuccess(boards));
} catch (error) {
  console.error("API Error:", error); // ← Add logging
  yield put(boardsFetchFailure(error.message));
}
```

---

## 📚 Documentation Files

- **REDUX_TUTORIAL.md** - Complete Redux guide with concepts
- **REDUX_FLOW.md** - Detailed flow diagrams (useEffect → response)
- **REDUX_QUICK_REFERENCE.md** - This file (quick reference)

---

## 💡 Best Practices

### ✅ Do

```typescript
// Use typed hooks
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// Keep reducers pure
const newState = { ...state, newValue: action.payload };

// Handle all request states
{ loading: false, error: null, data: [] }

// Use constants for action types
export const BOARDS_FETCH_REQUEST = "BOARDS_FETCH_REQUEST";

// Normalize complex data
{ byId: { '1': {...}, '2': {...} }, allIds: ['1', '2'] }
```

### ❌ Don't

```typescript
// Don't mutate state directly
state.boards.push(newBoard); // ❌

// Don't dispatch in render
function Component() {
  dispatch(action()); // ❌ Creates infinite loop
}

// Don't put functions in actions
dispatch({ type: 'ACTION', callback: () => {} }); // ❌

// Don't use magic strings
dispatch({ type: 'FETCH_BOARDS' }); // ❌ Use constants

// Don't store derived data
{ boards: [...], boardCount: 5 } // ❌ Calculate on the fly
```

---

## 🧪 Testing Examples

### Test Action Creator

```typescript
import { boardsFetchRequest } from "./boards.actions";

test("creates fetch request action", () => {
  const userId = "user123";
  const expected = {
    type: "BOARDS_FETCH_REQUEST",
    payload: { userId: "user123" },
  };
  expect(boardsFetchRequest(userId)).toEqual(expected);
});
```

### Test Reducer

```typescript
import boardsReducer from "./boards.reducer";

test("handles fetch success", () => {
  const initialState = { boards: [], loading: true, error: null };
  const action = {
    type: "BOARDS_FETCH_SUCCESS",
    payload: { boards: [{ id: "1", name: "Test" }] },
  };
  const newState = boardsReducer(initialState, action);

  expect(newState.boards).toHaveLength(1);
  expect(newState.loading).toBe(false);
});
```

### Test Saga

```typescript
import { call, put } from "redux-saga/effects";
import { fetchBoardsSaga } from "./boards.saga";

test("fetches boards successfully", () => {
  const action = {
    type: "BOARDS_FETCH_REQUEST",
    payload: { userId: "user123" },
  };
  const generator = fetchBoardsSaga(action);

  // First yield: API call
  expect(generator.next().value).toEqual(call(getBoardsApi, "user123"));

  // Second yield: Success dispatch
  const boards = [{ id: "1", name: "Test" }];
  expect(generator.next(boards).value).toEqual(put(boardsFetchSuccess(boards)));
});
```

---

## 🎓 Next Steps

Once comfortable with the basics:

1. **Add optimistic updates** - Update UI before API responds
2. **Add caching** - Don't refetch if data already exists
3. **Add pagination** - Load boards in pages
4. **Add real-time updates** - WebSocket integration
5. **Add persistence** - Save state to localStorage
6. **Add selectors with reselect** - Memoized computed values

---

## 🔗 Useful Resources

- [Redux Official Docs](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

---

**Happy coding!** 🚀 Keep this file handy while building your Redux features.
