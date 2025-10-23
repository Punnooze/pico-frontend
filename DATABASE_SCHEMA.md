# Database Schema & Architecture

## Overview

This document describes the database schema for the task management system, API endpoints, and implementation details.

---

## Collections

### 1. **Task Collection**

Stores all tasks across all boards.

```javascript
{
  _id: ObjectId,                   // MongoDB ObjectId
  taskId: String,                  // Human-readable ID (e.g., "T-100") - UNIQUE
  name: String,                    // Task name/title
  description: String,             // Task description

  // References for linking
  boardId: ObjectId,               // Reference to Board (indexed)
  categoryId: String,              // Reference to category.id in Board.categories

  // Cached fields (for quick access without joins)
  boardName: String,               // Cached board name
  categoryName: String,            // Cached category name

  // Task details
  priority: String,                // "high" | "medium" | "low"
  status: String,                  // Task status
  assignee: ObjectId | null,       // Reference to User
  dueDate: Date,                   // Due date
  tags: [String],                  // Task tags (e.g., ["DCB", "TECH TASK"])
  timeEstimate: String,            // Time estimate (e.g., "4h")
  size: String,                    // "S" | "M" | "LG" | "XL" | "XXL"
  jiraTicket: String,              // Optional Jira ticket URL

  // Metadata
  createdBy: ObjectId,             // User who created the task
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

```javascript
db.tasks.createIndex({ boardId: 1 });
db.tasks.createIndex({ taskId: 1 }, { unique: true });
db.tasks.createIndex({ boardId: 1, categoryId: 1 });
```

**Index Explanation:**

- `{ boardId: 1 }` - Fast lookup of all tasks in a board
- `{ taskId: 1 }` - Fast lookup by human-readable ID + ensures uniqueness
- `{ boardId: 1, categoryId: 1 }` - Fast lookup of tasks in a specific category within a board

---

### 2. **Board Collection**

Stores board information and categories.

```javascript
{
  _id: ObjectId,
  name: String,                    // Board name
  owner: ObjectId,                 // User who owns the board
  members: [ObjectId],             // Array of user IDs with access
  taskCounter: Number,             // Auto-increment counter for generating T-XXX IDs

  categories: [
    {
      id: String,                  // UUID or slug (e.g., "todo", "in-progress")
      name: String,                // Display name (e.g., "To Do")
      taskIds: [ObjectId],         // Ordered list of task IDs (for display order)
      order: Number,               // Category display order on board
      color: String,               // Hex color for UI
      createdAt: Date
    }
  ],

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

```javascript
db.boards.createIndex({ owner: 1 });
db.boards.createIndex({ members: 1 });
```

---

## API Endpoints

### **1. Load Board Page: `GET /api/boards/:boardId`**

Returns board details and all tasks grouped by category.

**Response:**

```javascript
{
  board: {
    _id: "...",
    name: "My first board",
    categories: [...]
  },
  tasksByCategory: {
    "todo": [ {...task}, {...task} ],
    "in-progress": [ {...task} ],
    "review": [],
    "done": []
  }
}
```

**Backend Implementation:**

```javascript
const board = await Board.findById(boardId);
const tasks = await Task.find({ boardId: boardId }).lean();

// Group tasks by categoryId on backend
const tasksByCategory = tasks.reduce((acc, task) => {
  if (!acc[task.categoryId]) acc[task.categoryId] = [];
  acc[task.categoryId].push(task);
  return acc;
}, {});

return { board, tasksByCategory };
```

**Performance:** Single query for all tasks with `{ boardId: 1 }` index = O(log n) lookup

---

### **2. Load Task Detail: `GET /api/tasks/:taskId`**

Returns full task details with populated references.

**Response:**

```javascript
{
  _id: "...",
  taskId: "T-100",
  name: "Setup project infrastructure",
  boardId: "...",
  boardName: "My first board",      // Cached field (no join needed)
  categoryName: "To Do",            // Cached field (no join needed)
  assignee: {
    _id: "...",
    name: "John Doe",
    email: "john@example.com"
  },
  // ... other fields
}
```

**Backend Implementation:**

```javascript
const task = await Task.findOne({ taskId: taskId })
  .populate("assignee", "name email avatar")
  .lean();

return task;
```

**Performance:** Single query with `{ taskId: 1 }` index

---

### **3. Move Task Between Categories: `PATCH /api/tasks/:taskId/move`**

Moves a task from one category to another.

**Request Body:**

```javascript
{
  newCategoryId: "in-progress",
  newCategoryName: "In Progress",
  newPosition: 2  // Optional: specific position in new category
}
```

**Backend Implementation (with Transaction):**

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Update task's categoryId and cached categoryName
  await Task.updateOne(
    { _id: taskId },
    {
      categoryId: newCategoryId,
      categoryName: newCategoryName,
      updatedAt: new Date(),
    },
    { session }
  );

  // 2. Remove from old category's taskIds array
  await Board.updateOne(
    { _id: boardId, "categories.id": oldCategoryId },
    { $pull: { "categories.$.taskIds": taskId } },
    { session }
  );

  // 3. Add to new category's taskIds array
  await Board.updateOne(
    { _id: boardId, "categories.id": newCategoryId },
    { $push: { "categories.$.taskIds": taskId } },
    { session }
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

### **4. Reorder Tasks Within Category: `PATCH /api/tasks/:taskId/reorder`**

Changes the position of a task within the same category.

**Request Body:**

```javascript
{
  newPosition: 3; // New index in the category's taskIds array
}
```

**Backend Implementation:**

```javascript
await Board.updateOne(
  { _id: boardId, "categories.id": categoryId },
  {
    $pull: { "categories.$.taskIds": taskId },
  }
);

await Board.updateOne(
  { _id: boardId, "categories.id": categoryId },
  {
    $push: {
      "categories.$.taskIds": {
        $each: [taskId],
        $position: newPosition,
      },
    },
  }
);
```

---

### **5. Create Task: `POST /api/tasks`**

Creates a new task and adds it to a category.

**Request Body:**

```javascript
{
  name: "New task",
  description: "Task description",
  boardId: "...",
  categoryId: "unassigned",  // Default to unassigned
  priority: "medium",
  dueDate: "2024-01-20",
  tags: ["APP"],
  size: "M",
  // ... other fields
}
```

**Backend Implementation:**

```javascript
// 1. Get board and increment taskCounter
const board = await Board.findById(boardId);
const newTaskId = `T-${board.taskCounter + 1}`;

// 2. Create task
const task = await Task.create({
  taskId: newTaskId,
  boardName: board.name,
  categoryName: board.categories.find((c) => c.id === categoryId).name,
  createdBy: userId,
  // ... other fields from request
});

// 3. Update board: increment counter and add to category
await Board.updateOne(
  { _id: boardId, "categories.id": categoryId },
  {
    $inc: { taskCounter: 1 },
    $push: { "categories.$.taskIds": task._id },
  }
);

return task;
```

---

## Design Decisions

### **Why store `boardId` and `categoryId` on Task?**

- **Source of truth**: Task location is always known from the task itself
- **Fast queries**: Can fetch all tasks for a board with a single indexed query
- **Scalability**: As boards grow, queries remain fast with proper indexes

### **Why store `taskIds` in Board categories?**

- **Display order**: Preserves the exact order of tasks in each category
- **Optional**: Can be rebuilt from tasks if corrupted
- **Performance**: No need to sort on every load

### **Why cache `boardName` and `categoryName` on Task?**

- **No joins needed**: Task detail page doesn't need to query the board
- **Performance**: Single query for task details
- **Trade-off**: Must update cached fields when board/category names change

### **Why use compound index `{ boardId: 1, categoryId: 1 }`?**

- **Versatility**: Can be used for queries with just `boardId` OR both fields
- **Efficiency**: Faster than using two separate indexes
- **Use case**: Load single category (lazy loading columns)

---

## Data Consistency

### **Cached Fields**

When board/category names change, update cached fields in tasks:

```javascript
// When board name changes
await Task.updateMany({ boardId: boardId }, { boardName: newBoardName });

// When category name changes
await Task.updateMany(
  { boardId: boardId, categoryId: categoryId },
  { categoryName: newCategoryName }
);
```

### **Rebuilding taskIds Array**

If `taskIds` array gets out of sync, rebuild from tasks:

```javascript
const tasks = await Task.find({ boardId, categoryId }).sort({ createdAt: 1 });
const taskIds = tasks.map((t) => t._id);

await Board.updateOne(
  { _id: boardId, "categories.id": categoryId },
  { $set: { "categories.$.taskIds": taskIds } }
);
```

---

## Frontend Data Structure

Current implementation uses static JSON file (`boardData.json`) for development:

```typescript
interface Category {
  id: string;
  name: string;
  taskIds: string[];
  order: number;
  color: string;
}

interface Board {
  _id: string;
  name: string;
  categories: Category[];
}

interface BoardData {
  board: Board;
  tasksByCategory: Record<string, Task[]>;
}
```

**Files:**

- `/utils/boardData.json` - Static board data (will be replaced by API)
- `/types/board.types.ts` - TypeScript interfaces
- `/components/Categories.tsx` - Displays categories (excludes "Unassigned")
- `/components/inbox.tsx` - Displays "Unassigned" category tasks

---

## Performance Characteristics

| Operation                    | Complexity | Notes                          |
| ---------------------------- | ---------- | ------------------------------ |
| Load board with all tasks    | O(log n)   | Single indexed query           |
| Load task detail             | O(log n)   | Single indexed query, no joins |
| Move task between categories | O(log n)   | 3 updates in transaction       |
| Reorder within category      | O(log n)   | 2 updates (pull + push)        |
| Create task                  | O(log n)   | Task insert + board update     |

Where n = total number of tasks in database

---

## Next Steps

1. **Backend**: Implement API endpoints following the schema
2. **Frontend**: Replace static JSON with API calls using Redux
3. **Real-time**: Add WebSocket support for collaborative editing
4. **Optimization**: Add Redis caching for frequently accessed boards
