# Mock Mode Configuration

## 🔧 Overview

The application is currently running in **MOCK MODE**, which means:

- API calls are made but responses are **ignored**
- Data comes from **`boardData.json`** file
- Optimistic updates work **exactly** as they will in production
- You can test drag-and-drop **without a backend**

---

## 🎯 Purpose

Mock mode allows you to:

1. ✅ Test optimistic updates without backend
2. ✅ See the full user experience
3. ✅ Verify toast notifications work
4. ✅ Debug Redux flow
5. ✅ Develop frontend independently

---

## 🚀 How It Works

### Loading Board Data

```typescript
// redux/network/boards.api.ts

const USE_MOCK_DATA = true; // 🔧 Mock mode flag

export const getBoardById = async (boardId: string) => {
  if (USE_MOCK_DATA) {
    // 1. Try to make API call (but ignore if it fails)
    await networkInstance.get(`${Api.boards}/${boardId}`).catch(() => {
      console.log("🔧 Mock mode: API failed, using mock data");
    });

    // 2. Return mock data from JSON file
    return boardData; // From utils/boardData.json
  }

  // Production: Use real API response
  const response = await networkInstance.get(`${Api.boards}/${boardId}`);
  return response.data;
};
```

**What happens:**

1. Frontend makes GET request to `/api/boards/:id`
2. API might return 404 or wrong format → **Ignored**
3. Frontend uses `boardData.json` instead
4. UI displays mock data perfectly

---

### Moving Tasks (Optimistic Update)

```typescript
export const moveTaskApi = async (payload: MoveTaskPayload) => {
  if (USE_MOCK_DATA) {
    console.log("🔧 Mock mode: Simulating task move", payload);

    // 1. Simulate network delay (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 2. Try to make API call (but ignore response)
    await networkInstance.patch(`/api/boards/.../move`, payload).catch(() => {
      console.log("🔧 Mock mode: API failed, but that's OK");
    });

    // 3. Always succeed in mock mode
    console.log("✅ Mock API: Task move completed");
    return;
  }

  // Production: Use real API (throw on error)
  await networkInstance.patch(`/api/boards/.../move`, payload);
};
```

**What happens:**

1. User drags task → **UI updates instantly** (optimistic)
2. API call made to PATCH `/api/boards/:id/tasks/:id/move`
3. API might fail → **Ignored** in mock mode
4. After 200ms delay → **Success toast** appears
5. Task stays in new position

**Result:** Optimistic updates work perfectly, even without backend!

---

## 📂 Mock Data Structure

### File: `utils/boardData.json`

```json
{
  "board": {
    "_id": "68e5647b50b6da7d17a9c32b",
    "name": "My first board",
    "categories": [
      {
        "id": "todo",
        "name": "To Do",
        "taskIds": ["task_001", "task_003"],
        "order": 1,
        "color": "#3B82F6"
      },
      {
        "id": "in-progress",
        "name": "In Progress",
        "taskIds": ["task_002"],
        "order": 2,
        "color": "#F59E0B"
      }
    ]
  },
  "tasksByCategory": {
    "todo": [
      {
        "_id": "task_001",
        "taskId": "T-100",
        "name": "Setup project infrastructure",
        "categoryId": "todo",
        "categoryName": "To Do"
        // ... all task fields
      }
    ],
    "in-progress": [
      {
        "_id": "task_002",
        "taskId": "T-101",
        "name": "Design user authentication flow",
        "categoryId": "in-progress",
        "categoryName": "In Progress"
        // ... all task fields
      }
    ]
  }
}
```

---

## 🧪 Testing with Mock Mode

### Test Case 1: Load Board

```bash
# 1. Navigate to /boards/68e5647b50b6da7d17a9c32b
# 2. See console: "🔧 Mock mode: Using boardData.json"
# 3. Board loads with tasks from JSON file
```

**Expected:**

- ✅ Board displays "My first board"
- ✅ Categories: "To Do", "In Progress", "Review", "Done"
- ✅ Tasks appear in correct categories
- ✅ No errors in console

---

### Test Case 2: Drag Task

```bash
# 1. Drag task from "To Do" to "In Progress"
# 2. See console: "🔧 Mock mode: Simulating task move"
# 3. Wait 200ms
# 4. See console: "✅ Mock API: Task move completed"
```

**Expected:**

- ✅ Task moves **instantly** (optimistic update)
- ✅ After 200ms: Toast "Task moved successfully"
- ✅ Task stays in new position
- ✅ No rollback (always succeeds in mock mode)

---

### Test Case 3: Multiple Drags

```bash
# 1. Drag task_001 from "To Do" → "In Progress"
# 2. Immediately drag task_002 from "In Progress" → "Done"
# 3. Both moves happen instantly
```

**Expected:**

- ✅ Both tasks move instantly
- ✅ Both show success toasts (200ms apart)
- ✅ Both stay in new positions

---

## 🔄 Switching to Production Mode

When your backend is ready:

### Step 1: Update Mock Flag

```typescript
// redux/network/boards.api.ts

const USE_MOCK_DATA = false; // ✅ Disable mock mode
```

### Step 2: Verify Backend Endpoints

Ensure these exist:

```http
GET  /api/boards/:boardId
PATCH /api/boards/:boardId/tasks/:taskId/move
```

### Step 3: Test with Real API

```bash
# 1. Drag a task
# 2. Check Network tab → API call succeeds
# 3. Refresh page → Task is in new position
```

---

## 📊 Mock vs Production Comparison

| Feature                 | Mock Mode                  | Production Mode          |
| ----------------------- | -------------------------- | ------------------------ |
| **Board data source**   | `boardData.json`           | Real API response        |
| **Task move behavior**  | Always succeeds            | Can fail (network error) |
| **API calls made?**     | ✅ Yes (but ignored)       | ✅ Yes (response used)   |
| **Optimistic updates**  | ✅ Works                   | ✅ Works                 |
| **Rollback on error**   | ❌ Never (always succeeds) | ✅ Yes (if API fails)    |
| **Toast notifications** | ✅ Shows success           | ✅ Shows success/error   |
| **Network delay**       | 200ms simulated            | Real network latency     |

---

## 🎨 Console Messages in Mock Mode

### On Board Load:

```
🔧 Mock mode: Using boardData.json for board 68e5647b50b6da7d17a9c32b
```

### On Task Drag:

```
🔧 Mock mode: Simulating task move {
  taskId: "task_001",
  oldCategoryId: "todo",
  newCategoryId: "in-progress",
  ...
}
🔧 Mock mode: API call failed, but that's OK (using optimistic update)
✅ Mock API: Task move completed successfully
```

### If API Actually Works:

```
🔧 Mock mode: Simulating task move {...}
✅ Mock API: Task move completed successfully
```

---

## ⚠️ Important Notes

### Mock Mode Limitations

1. **Data doesn't persist**

   - Dragging tasks updates Redux state
   - Refreshing page → back to `boardData.json`
   - Tasks return to original positions

2. **Always succeeds**

   - Can't test error handling
   - No rollback happens
   - Always shows success toast

3. **Single board only**
   - Only board with ID `68e5647b50b6da7d17a9c32b` has mock data
   - Other board IDs will fail

### How to Test Errors

To test rollback/error handling, you need to:

```typescript
// Temporarily force errors in mock mode
export const moveTaskApi = async (payload: MoveTaskPayload) => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Force failure for testing
    throw new Error("Mock API: Testing error handling");
  }
  // ...
};
```

Then drag a task and you'll see:

- ❌ Task rolls back to original position
- ❌ Toast: "Failed to move task: Mock API: Testing error handling"

---

## 🔧 Customizing Mock Data

### Add More Tasks

Edit `utils/boardData.json`:

```json
{
  "tasksByCategory": {
    "todo": [
      // Add new task here
      {
        "_id": "task_006",
        "taskId": "T-105",
        "name": "New task",
        "categoryId": "todo",
        "categoryName": "To Do"
        // ... other fields
      }
    ]
  }
}
```

### Add More Categories

```json
{
  "board": {
    "categories": [
      // Add new category
      {
        "id": "blocked",
        "name": "Blocked",
        "taskIds": [],
        "order": 5,
        "color": "#EF4444"
      }
    ]
  },
  "tasksByCategory": {
    "blocked": []
  }
}
```

---

## 🚀 Benefits of Mock Mode

1. **Develop frontend independently** - No backend needed
2. **Fast iteration** - Change JSON file, see results instantly
3. **Test optimistic updates** - Full flow works without API
4. **Demo-ready** - Show working app without backend
5. **Easy debugging** - Mock data is predictable

---

## 📝 Quick Reference

### Enable Mock Mode

```typescript
const USE_MOCK_DATA = true;
```

### Disable Mock Mode

```typescript
const USE_MOCK_DATA = false;
```

### Mock Data File

```
utils/boardData.json
```

### Where Mock Logic Lives

```
redux/network/boards.api.ts
```

---

## 🎉 Summary

**Current State:**

- ✅ Mock mode is **enabled**
- ✅ Board data comes from **JSON file**
- ✅ Optimistic updates **work perfectly**
- ✅ No backend required
- ✅ Ready to switch to production when backend is ready

**What Works:**

- Loading boards ✅
- Displaying tasks ✅
- Dragging tasks ✅
- Optimistic updates ✅
- Toast notifications ✅
- Redux flow ✅

**What to Do When Backend is Ready:**

1. Set `USE_MOCK_DATA = false`
2. Test with real API
3. Deploy! 🚀

---

**That's it! Mock mode is configured and working perfectly!** 🎊
