# Redux Flow - Complete Data Journey

This document shows the **exact path** that data takes through your Redux application, from the moment a component loads to when it displays the data.

---

## 🎯 The Complete Flow: Step-by-Step

### Visual Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         COMPONENT MOUNTS                             │
│                   (app/(dashboard)/boards/page.tsx)                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ├─ useEffect(() => {}, [])
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: Dispatch Action                                             │
│  dispatch(boardsFetchRequest('user123'))                             │
│                                                                       │
│  Creates action object:                                              │
│  { type: 'BOARDS_FETCH_REQUEST', payload: { userId: 'user123' } }   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Action sent to Redux Store
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Store receives action                                       │
│  Store passes action through middleware pipeline                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ┌──────────────────┐        ┌──────────────────┐
          │  Saga Middleware │        │     Reducer      │
          │   (INTERCEPTS)   │        │   (RECEIVES)     │
          └──────────────────┘        └──────────────────┘
                    │                           │
                    │                           │
                    ▼                           ▼
          ┌──────────────────┐        ┌──────────────────┐
          │ Saga sees action │        │ Reducer updates  │
          │ type matches     │        │ loading: true    │
          │ BOARDS_FETCH_    │        │ error: null      │
          │ REQUEST          │        └──────────────────┘
          └──────────────────┘                 │
                    │                           │
                    │                           ▼
                    │                  ┌──────────────────┐
                    │                  │ Component        │
                    │                  │ re-renders with  │
                    │                  │ loading=true     │
                    │                  │ (Shows spinner)  │
                    │                  └──────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Saga executes (redux/sagas/boards.saga.ts)                 │
│                                                                       │
│  function* fetchBoardsSaga(action) {                                 │
│    const { userId } = action.payload;  // Extract 'user123'          │
│    const boards = yield call(getBoardsApi, userId);                  │
│  }                                                                    │
│                                                                       │
│  Saga PAUSES here and waits for API call to complete                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Calls API function
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: API Call (redux/network/boards.api.ts)                     │
│                                                                       │
│  export const getBoardsApi = async (userId: string) => {             │
│    const response = await axios.get(                                 │
│      'http://localhost:3001/api/getBoards',                          │
│      { params: { userId: 'user123' } }                               │
│    );                                                                 │
│    return response.data;                                             │
│  }                                                                    │
│                                                                       │
│  Makes HTTP request to backend                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP GET Request
                                  │ URL: http://localhost:3001/api/getBoards?userId=user123
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5: Backend API Endpoint                                        │
│  (Your backend server)                                               │
│                                                                       │
│  Receives request, queries database, returns JSON:                   │
│  [                                                                    │
│    {                                                                  │
│      id: '1',                                                         │
│      name: 'Project Board',                                          │
│      color: '#ff6b6b',                                               │
│      userId: 'user123',                                              │
│      starred: false                                                  │
│    },                                                                 │
│    { ... more boards ... }                                           │
│  ]                                                                    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Response (200 OK)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 6: API function returns data                                   │
│  (redux/network/boards.api.ts)                                       │
│                                                                       │
│  return response.data; // Returns the array of boards                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Returns to Saga
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 7: Saga receives data and dispatches success action           │
│  (redux/sagas/boards.saga.ts)                                        │
│                                                                       │
│  function* fetchBoardsSaga(action) {                                 │
│    try {                                                              │
│      const boards = yield call(getBoardsApi, userId);                │
│      // boards now contains the array from API                       │
│                                                                       │
│      yield put(boardsFetchSuccess(boards));                          │
│      // This dispatches a NEW action!                                │
│    }                                                                  │
│  }                                                                    │
│                                                                       │
│  New action created:                                                 │
│  {                                                                    │
│    type: 'BOARDS_FETCH_SUCCESS',                                     │
│    payload: { boards: [...] }                                        │
│  }                                                                    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Dispatches success action
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 8: Store receives BOARDS_FETCH_SUCCESS action                 │
│  Store passes action to reducer                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 9: Reducer processes success action                           │
│  (redux/reducers/boards.reducer.ts)                                  │
│                                                                       │
│  const boardsReducer = (state, action) => {                          │
│    switch (action.type) {                                            │
│      case BOARDS_FETCH_SUCCESS:                                      │
│        return {                                                       │
│          ...state,                        // Keep other properties   │
│          loading: false,                  // Stop loading            │
│          boards: action.payload.boards,   // Store the boards!       │
│          error: null                      // Clear errors            │
│        };                                                             │
│    }                                                                  │
│  }                                                                    │
│                                                                       │
│  State BEFORE:                                                       │
│  { boards: [], loading: true, error: null }                          │
│                                                                       │
│  State AFTER:                                                        │
│  { boards: [{...}, {...}], loading: false, error: null }             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ New state stored
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 10: Store updates and notifies subscribers                    │
│  (redux/store.ts)                                                     │
│                                                                       │
│  Store's internal state tree is now updated                          │
│  All components using useAppSelector are notified                    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Notification sent to component
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 11: Component re-renders with new data                        │
│  (app/(dashboard)/boards/page.tsx)                                   │
│                                                                       │
│  const boards = useAppSelector(state => state.boards.boards);        │
│  // boards is now [{...}, {...}] - populated!                        │
│                                                                       │
│  const loading = useAppSelector(state => state.boards.loading);      │
│  // loading is now false                                             │
│                                                                       │
│  React re-renders the component with new values                      │
│                                                                       │
│  {!loading && !error && (                                            │
│    <div>                                                              │
│      {boards.map(board => (                                          │
│        <div key={board.id}>{board.name}</div>                        │
│      ))}                                                              │
│    </div>                                                             │
│  )}                                                                   │
│                                                                       │
│  User sees the boards on screen! 🎉                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Code Walkthrough with Line Numbers

Let's trace through the actual code files:

### 1️⃣ Component Mounts and Dispatches

**File**: `app/(dashboard)/boards/page.tsx`

```typescript
// Lines 19-27: Component initializes
function Page() {
  const dispatch = useAppDispatch();  // Get dispatch function
  const boards = useAppSelector((state) => state.boards.boards);   // Initially []
  const loading = useAppSelector((state) => state.boards.loading); // Initially false
  const error = useAppSelector((state) => state.boards.error);     // Initially null

  // Lines 53-60: useEffect runs ONCE when component mounts
  useEffect(() => {
    const userId = "user123";

    // 🚀 THIS LINE STARTS THE ENTIRE FLOW!
    dispatch(boardsFetchRequest(userId));
    //      └─> Goes to actions file
  }, []); // Empty array = run once on mount
```

### 2️⃣ Action Creator Creates Action Object

**File**: `redux/actions/boards.actions.ts`

```typescript
// Lines 50-55: This function is called by dispatch()
export const boardsFetchRequest = (
  userId: string
): BoardsFetchRequestAction => ({
  type: BOARDS_FETCH_REQUEST, // 'BOARDS_FETCH_REQUEST'
  payload: { userId }, // { userId: 'user123' }
});

// This returns:
// {
//   type: 'BOARDS_FETCH_REQUEST',
//   payload: { userId: 'user123' }
// }
//
// This object is sent to the Redux store
```

### 3️⃣ Reducer Receives Action FIRST (sets loading=true)

**File**: `redux/reducers/boards.reducer.ts`

```typescript
// Lines 37-50: Reducer processes BOARDS_FETCH_REQUEST
const boardsReducer = (
  state: BoardsState = initialState,
  action: BoardsActionTypes
): BoardsState => {
  switch (action.type) {
    case BOARDS_FETCH_REQUEST:
      return {
        ...state,       // Keep existing state
        loading: true,  // 🔄 SET LOADING TO TRUE
        error: null,    // Clear any previous errors
      };
      // Component re-renders, shows "Loading..." spinner
```

### 4️⃣ Saga Intercepts Action (runs in parallel)

**File**: `redux/sagas/boards.saga.ts`

```typescript
// Lines 79-82: Watcher saga is listening
function* watchFetchBoards() {
  yield takeLatest(BOARDS_FETCH_REQUEST, fetchBoardsSaga);
  //                └─ Matches!        └─ Calls this function
}

// Lines 36-68: Worker saga executes
function* fetchBoardsSaga(action: BoardsFetchRequestAction) {
  try {
    // Extract userId from action
    const { userId } = action.payload; // 'user123'

    // 🌐 CALL API - Saga pauses here and waits
    const boards: Board[] = yield call(getBoardsApi, userId);
    //                                  └─> Goes to API file
    //                      yield = wait for response

    // When API returns, saga continues here...
    yield put(boardsFetchSuccess(boards));
    //        └─> Dispatches success action
  } catch (error) {
    // If API fails, dispatch failure action
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    yield put(boardsFetchFailure(errorMessage));
  }
}
```

### 5️⃣ API Function Makes HTTP Request

**File**: `redux/network/boards.api.ts`

```typescript
// Lines 36-52: API function executes
export const getBoardsApi = async (userId: string): Promise<Board[]> => {
  try {
    // 🌐 Make HTTP GET request
    const response = await axios.get(`${API_BASE_URL}/getBoards`, {
      params: { userId }, // Query param: ?userId=user123
    });
    // Full URL: http://localhost:3001/api/getBoards?userId=user123

    // ⏳ Waits for backend to respond...

    // When response arrives:
    return response.data; // Returns array of boards
    //     └─> Goes back to saga
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error; // Saga will catch this in the catch block
  }
};
```

### 6️⃣ Backend Responds (your backend server)

```javascript
// Example backend endpoint (not in this project)
app.get("/api/getBoards", async (req, res) => {
  const { userId } = req.query; // 'user123'

  // Query database
  const boards = await db.boards.find({ userId });

  // Send response
  res.json([
    {
      id: "1",
      name: "Project Board",
      color: "#ff6b6b",
      userId: "user123",
      starred: false,
      createdAt: "2025-10-01T...",
      updatedAt: "2025-10-01T...",
    },
    // ... more boards
  ]);
});
```

### 7️⃣ Saga Receives Data and Dispatches Success

**File**: `redux/sagas/boards.saga.ts`

```typescript
// Continuing from step 4...
function* fetchBoardsSaga(action: BoardsFetchRequestAction) {
  try {
    const boards: Board[] = yield call(getBoardsApi, userId);
    // boards is now: [{id: '1', name: 'Project Board', ...}, {...}]

    // 🎯 DISPATCH SUCCESS ACTION
    yield put(boardsFetchSuccess(boards));
    //        └─> Goes to actions file
  } catch (error) {
    // Not executed if API succeeded
  }
}
```

### 8️⃣ Success Action Creator Creates Action

**File**: `redux/actions/boards.actions.ts`

```typescript
// Lines 60-64: Create success action object
export const boardsFetchSuccess = (
  boards: Board[]
): BoardsFetchSuccessAction => ({
  type: BOARDS_FETCH_SUCCESS, // 'BOARDS_FETCH_SUCCESS'
  payload: { boards }, // { boards: [{...}, {...}] }
});

// Returns:
// {
//   type: 'BOARDS_FETCH_SUCCESS',
//   payload: {
//     boards: [
//       { id: '1', name: 'Project Board', ... },
//       { id: '2', name: 'Design Board', ... }
//     ]
//   }
// }
```

### 9️⃣ Reducer Updates State with Data

**File**: `redux/reducers/boards.reducer.ts`

```typescript
// Lines 52-58: Reducer handles success action
const boardsReducer = (state, action) => {
  switch (action.type) {
    case BOARDS_FETCH_SUCCESS:
      return {
        ...state, // Keep other properties
        loading: false, // ✅ STOP LOADING
        boards: action.payload.boards, // 📦 STORE THE BOARDS
        error: null, // Clear errors
      };
  }
};

// State transformation:
// BEFORE: { boards: [], loading: true, error: null }
// AFTER:  { boards: [{...}, {...}], loading: false, error: null }
```

### 🔟 Component Re-renders with Data

**File**: `app/(dashboard)/boards/page.tsx`

```typescript
// React detects state change and re-runs the component
function Page() {
  const dispatch = useAppDispatch();

  // 🔄 These hooks get NEW values from updated state
  const boards = useAppSelector((state) => state.boards.boards);
  // boards is now: [{id: '1', ...}, {id: '2', ...}]

  const loading = useAppSelector((state) => state.boards.loading);
  // loading is now: false

  const error = useAppSelector((state) => state.boards.error);
  // error is still: null

  return (
    <div>
      {/* Lines 76-80: Loading is false, so this doesn't show */}
      {loading && <div>Loading boards...</div>}

      {/* Lines 83-87: No error, so this doesn't show */}
      {error && <div>Error: {error}</div>}

      {/* Lines 90-122: This DOES render! */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-[20px] mt-[40px]">
          {boards.map((board) => (
            // 🎨 Renders each board card
            <div key={board.id}>
              <div style={{ backgroundColor: board.color }}>
                {/* Star icon */}
              </div>
              <div>{board.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// User now sees all their boards on the screen! 🎉
```

---

## ⏱️ Timeline View

Here's the same flow in a timeline format:

```
Time →

0ms     Component mounts
        ├─ useEffect runs
        └─ dispatch(boardsFetchRequest('user123'))

1ms     Action object created: { type: 'BOARDS_FETCH_REQUEST', payload: {...} }

2ms     Store receives action
        ├─ Reducer: sets loading=true
        └─ Saga: intercepts action

3ms     Component re-renders (loading=true, shows spinner)

4ms     Saga calls getBoardsApi('user123')

5ms     Axios makes HTTP GET request to backend

⏳      [Waiting for network response...]

200ms   Backend responds with boards data

201ms   getBoardsApi returns data to saga

202ms   Saga dispatches: boardsFetchSuccess([{...}, {...}])

203ms   Action object created: { type: 'BOARDS_FETCH_SUCCESS', payload: {...} }

204ms   Reducer: updates state with boards, sets loading=false

205ms   Component re-renders with boards data

206ms   User sees boards on screen! 🎉
```

---

## 🔄 Error Flow

What happens if the API call fails?

```
┌─────────────────┐
│  API Call Fails │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ getBoardsApi throws     │
│ error                   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Saga catch block        │
│ catches error           │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ yield put(              │
│   boardsFetchFailure(   │
│     error.message       │
│   )                     │
│ )                       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Reducer handles         │
│ BOARDS_FETCH_FAILURE    │
│                         │
│ Sets:                   │
│ - loading: false        │
│ - error: "message"      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Component re-renders    │
│ Shows error message     │
└─────────────────────────┘
```

---

## 🎓 Key Takeaways

1. **useEffect** triggers the flow by dispatching an action
2. **Action** is a plain object describing what happened
3. **Reducer** updates state immediately (loading=true)
4. **Saga** intercepts action and handles async work
5. **API call** happens outside Redux
6. **Saga** dispatches success/failure action when done
7. **Reducer** updates state with data (loading=false, boards=[...])
8. **Component** automatically re-renders with new data

### The Magic of Redux

- Component doesn't know about API calls
- API doesn't know about Redux
- Saga handles all the complexity
- Reducer keeps state predictable
- Everything is decoupled and testable!

---

## 🔍 Debugging Tips

### See the flow in Redux DevTools

1. Open Redux DevTools in browser
2. Watch the Actions tab:

   ```
   ⚡ BOARDS_FETCH_REQUEST  { userId: 'user123' }
   ⚡ BOARDS_FETCH_SUCCESS  { boards: [...] }
   ```

3. See state changes in Diff tab:
   ```
   boards.loading:  true  → false
   boards.boards:   []    → [{...}, {...}]
   ```

### Console logging at each step

```typescript
// In component
console.log("1. Dispatching action");
dispatch(boardsFetchRequest(userId));

// In saga
console.log("2. Saga received action:", action);
console.log("3. Calling API...");
const boards = yield call(getBoardsApi, userId);
console.log("4. API returned:", boards);

// In reducer
console.log("5. Reducer updating state:", action.type);
```

---

**You now have a complete understanding of the Redux flow!** 🚀

Every piece of data follows this exact path through your application. Once you understand this flow, Redux becomes much easier to work with.
