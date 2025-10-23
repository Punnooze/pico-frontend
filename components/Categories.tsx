import React, { useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { Task } from "./UnassignedTasks";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskComponent from "./TaskComponent";
import type { Category } from "@/types/board.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  moveTaskOptimistic,
  moveTaskRequest,
} from "@/redux/actions/boards.actions";
import { usePathname } from "next/navigation";

// Droppable container for empty columns
function DroppableColumn({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

function Categories() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const boardId = pathname.split("/").pop() || "";

  const board = useAppSelector((state) => state.boards.currentBoard);
  const reduxTasksByCategory = useAppSelector(
    (state) => state.boards.currentTasksByCategory
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [tasksByCategory, setTasksByCategory] = useState<
    Record<string, Task[]>
  >({});

  useEffect(() => {
    // Use Redux data when available
    if (board && reduxTasksByCategory) {
      const filteredCategories = board.categories
        .filter((cat) => cat.name !== "Unassigned")
        .sort((a, b) => a.order - b.order);

      setCategories(filteredCategories);
      setTasksByCategory(reduxTasksByCategory);
    }
  }, [board, reduxTasksByCategory]);

  const findContainer = (id: string): string | null => {
    for (const category of categories) {
      if (tasksByCategory[category.id]?.find((task) => task._id === id)) {
        return category.id;
      }
    }
    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id as string);

    // Check if over.id is a category container (for empty categories)
    let overContainer: string | null = null;
    const isCategoryId = categories.some((cat) => cat.id === over.id);

    if (isCategoryId) {
      overContainer = over.id as string;
    } else {
      overContainer = findContainer(over.id as string);
    }

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // Create optimistic update
    const activeItems = tasksByCategory[activeContainer] || [];
    const overItems = tasksByCategory[overContainer!] || [];
    const activeIndex = activeItems.findIndex((t) => t._id === active.id);
    const movedTask = activeItems[activeIndex];

    if (!movedTask) return;

    // Update task's category info
    const updatedTask = {
      ...movedTask,
      categoryId: overContainer,
      categoryName: categories.find((c) => c.id === overContainer)?.name || "",
    };

    let updatedTasksByCategory: Record<string, Task[]>;

    if (isCategoryId) {
      // Dropping on empty category, append
      updatedTasksByCategory = {
        ...tasksByCategory,
        [activeContainer]: activeItems.filter((t) => t._id !== active.id),
        [overContainer!]: [...overItems, updatedTask],
      };
    } else {
      // Dropping at specific position
      const overIndex = overItems.findIndex((t) => t._id === over.id);
      updatedTasksByCategory = {
        ...tasksByCategory,
        [activeContainer]: activeItems.filter((t) => t._id !== active.id),
        [overContainer!]: [
          ...overItems.slice(0, overIndex),
          updatedTask,
          ...overItems.slice(overIndex),
        ],
      };
    }

    // Update local state for immediate UI feedback
    setTasksByCategory(updatedTasksByCategory);

    // Dispatch optimistic update to Redux
    const optimisticId = `${active.id}_${Date.now()}`;
    dispatch(
      moveTaskOptimistic(
        active.id as string,
        activeContainer,
        overContainer,
        categories.find((c) => c.id === overContainer)?.name || "",
        updatedTasksByCategory
      )
    );

    // Dispatch API request with snapshot for rollback
    dispatch(
      moveTaskRequest(
        optimisticId,
        active.id as string,
        boardId,
        activeContainer,
        overContainer,
        categories.find((c) => c.id === overContainer)?.name || "",
        tasksByCategory // Snapshot before change
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeContainer = findContainer(active.id as string);

    // Check if over.id is a category container
    let overContainer: string | null = null;
    const isCategoryId = categories.some((cat) => cat.id === over.id);

    if (isCategoryId) {
      overContainer = over.id as string;
    } else {
      overContainer = findContainer(over.id as string);
    }

    if (!activeContainer || !overContainer) return;

    // If dropping on category container (empty category), no reordering needed
    if (isCategoryId) {
      return;
    }

    // Reorder within same category
    if (activeContainer === overContainer) {
      setTasksByCategory((prev) => {
        const items = prev[activeContainer] || [];
        const activeIndex = items.findIndex((t) => t._id === active.id);
        const overIndex = items.findIndex((t) => t._id === over.id);

        return {
          ...prev,
          [activeContainer]: arrayMove(items, activeIndex, overIndex),
        };
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="flex gap-4 min-w-max">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={closestCorners}
      >
        {categories.map((category) => {
          const categoryTasks = tasksByCategory[category.id] || [];

          return (
            <DroppableColumn key={category.id} id={category.id}>
              <div className="w-[240px] bg-primary-bg/70 rounded-md min-h-[200px] overflow-clip">
                <div
                  className="font-bold mb-2 p-[10px] flex justify-start"
                  style={{ backgroundColor: category.color }}
                >
                  <h3>{category.name}</h3>
                </div>
                <div className="p-[10px]">
                  <SortableContext
                    items={categoryTasks.map((task) => task._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {categoryTasks.map((task) => (
                      <TaskComponent task={task} key={task._id} />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </DroppableColumn>
          );
        })}
      </DndContext>
    </div>
  );
}

export default Categories;
