"use client";

import React, { useEffect, useState } from "react";
import {
  pointerWithin,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Task } from "./UnassignedTasks";
import type { Category } from "@/types/board.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  moveTaskOptimistic,
  moveTaskRequest,
} from "@/redux/actions/boards.actions";
import { usePathname } from "next/navigation";
import Inbox from "./inbox";
import Categories from "./Categories";

interface BoardContentProps {
  sidebarOpen: boolean;
  boardOpen: boolean;
}

function BoardContent({ sidebarOpen, boardOpen }: BoardContentProps) {
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
      // Include all categories (including "Unassigned")
      const allCategories = board.categories.sort((a, b) => a.order - b.order);

      setCategories(allCategories);
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

    // Create optimistic update for UI only (no Redux dispatch)
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

    // Update local state ONLY for visual feedback during drag
    setTasksByCategory(updatedTasksByCategory);
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

    // Only dispatch if moving between categories
    if (activeContainer !== overContainer) {
      const optimisticId = `${active.id}_${Date.now()}`;
      const newCategoryName =
        categories.find((c) => c.id === overContainer)?.name || "";

      // Dispatch optimistic update to Redux
      dispatch(
        moveTaskOptimistic(
          active.id as string,
          activeContainer,
          overContainer,
          newCategoryName,
          tasksByCategory
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
          newCategoryName,
          tasksByCategory // Snapshot for rollback
        )
      );
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay before drag starts on touch
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={pointerWithin}
    >
      <div className="flex h-full w-full">
        <div className="grid-cols-6 grid h-full w-full gap-[10px]">
          {sidebarOpen && (
            <div
              className={`relative rounded-md ${boardOpen ? "" : "col-span-6"}`}
            >
              <Inbox tasks={tasksByCategory.unassigned || []} />
            </div>
          )}
          {boardOpen && (
            <div
              className={`${
                sidebarOpen ? "col-span-5" : "col-span-6"
              }  rounded-md overflow-clip bg-secondary-bg p-[10px]`}
            >
              <Categories
                categories={categories.filter(
                  (cat) => cat.name !== "Unassigned"
                )}
                tasksByCategory={tasksByCategory}
              />
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default BoardContent;
