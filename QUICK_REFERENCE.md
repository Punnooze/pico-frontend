# Quick Reference: Optimistic Updates

## 🚀 TL;DR

When a user drags a task:

1. UI updates **instantly** (0ms)
2. API request happens in **background**
3. If API fails → **automatic rollback** + error toast
4. If API succeeds → success toast

---

## 📂 File Structure

```
frontend/
├── redux/
│   ├── keys/
│   │   └── boards.keys.ts          ← Action type constants
│   ├── actions/
│   │   └── boards.actions.ts       ← Action creators + interfaces
│   ├── network/
│   │   └── boards.api.ts           ← API call function
│   ├── sagas/
│   │   └── boards.saga.ts          ← API + rollback logic
│   └── reducers/
│       └── boards.reducer.ts       ← State management + rollback
├── components/
│   └── Categories.tsx              ← Drag-and-drop + dispatch
├── app/
│   └── layout.tsx                  ← Toast provider
└── docs/
    ├── OPTIMISTIC_UPDATES.md       ← Full guide
    ├── IMPLEMENTATION_SUMMARY.md   ← Summary
    └── QUICK_REFERENCE.md          ← This file
```

---

## 🔑 Key Concepts

### Optimistic Update

```typescript
// Update UI first, API later
dispatch(moveTaskOptimistic(...)); // UI updates
dispatch(moveTaskRequest(...));    // API happens
```

### Snapshot for Rollback

```typescript
const snapshot = { ...tasksByCategory }; // Before change
// If API fails, restore snapshot
```

### Unique Optimistic ID

```typescript
const optimisticId = `${taskId}_${Date.now()}`;
// Tracks each drag operation
```

---

## 📝 Backend Endpoint Needed

```http
PATCH /api/boards/:boardId/tasks/:taskId/move

Body:
{
  "oldCategoryId": "todo",
  "newCategoryId": "in-progress",
  "newCategoryName": "In Progress"
}

Response: 200 OK
{
  "success": true
}
```

---

## 🧪 Quick Test

```bash
# 1. Start backend
npm run dev

# 2. Open frontend
# 3. Drag a task between columns

# Expected:
✅ Task moves instantly
✅ Toast: "Task moved successfully"
✅ No lag or loading spinner
```

---

## 🐛 Debug Checklist

**Task doesn't move?**

- [ ] Check console for errors
- [ ] Check Redux DevTools (action dispatched?)
- [ ] Check Network tab (API called?)

**Task rolls back?**

- [ ] Backend running?
- [ ] Correct API endpoint?
- [ ] Auth token valid?
- [ ] Check toast error message

**Multiple toasts appear?**

- [ ] Dragging too fast?
- [ ] Check `optimisticId` is unique

---

## 📊 Redux State Shape

```typescript
boards: {
  currentBoard: Board | null,
  currentTasksByCategory: {
    "todo": [Task, Task],
    "in-progress": [Task],
    "done": []
  },
  optimisticUpdates: ["task_001_1234567890"], // Pending updates
  loading: false,
  error: null
}
```

---

## 🎨 Toast Notifications

```typescript
// Success
toast.success("Task moved successfully");

// Error (with rollback)
toast.error("Failed to move task: Network error");
```

---

## 🔧 Common Modifications

### Change Toast Position

```typescript
// app/layout.tsx
<Toaster position="top-right" richColors />
//                 ↑ Change here
```

### Change Toast Duration

```typescript
// redux/sagas/boards.saga.ts
toast.success("Task moved successfully", {
  duration: 5000, // 5 seconds
});
```

### Disable Rollback (Not Recommended)

```typescript
// redux/sagas/boards.saga.ts
catch (error) {
  // Just show error, don't rollback
  toast.error("Failed to move task");
  // Remove: yield put(moveTaskFailure(...));
}
```

---

## 📈 Performance

| Action    | Time                   |
| --------- | ---------------------- |
| UI update | 0ms ⚡                 |
| API call  | 100-500ms (background) |
| Rollback  | 0ms (if needed)        |

---

## 🎯 Key Files to Know

1. **Categories.tsx** - Where drag happens
2. **boards.saga.ts** - Where API + rollback logic lives
3. **boards.reducer.ts** - Where state updates happen

---

## 💡 Pro Tips

1. **Monitor Redux DevTools** - See optimistic updates in real-time
2. **Test with slow 3G** - See optimistic updates shine
3. **Check toast notifications** - Users should rarely see errors
4. **Use unique optimisticId** - Prevents update conflicts

---

## 🚨 Important Notes

- ⚠️ Backend endpoint MUST be implemented
- ⚠️ Use transactions in backend (see DATABASE_SCHEMA.md)
- ⚠️ Don't remove snapshot from actions (needed for rollback)
- ⚠️ Don't disable toast notifications (users need feedback)

---

## 📞 Need Help?

1. **Read full guide**: `OPTIMISTIC_UPDATES.md`
2. **Check implementation**: `IMPLEMENTATION_SUMMARY.md`
3. **Understand schema**: `SCHEMA_EXPLAINED.md`

---

**That's it! You're ready to use optimistic updates! 🎉**
