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
import boardData from "@/utils/boardData.json";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskComponent from "./TaskComponent";
import type { Category } from "@/types/board.types";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasksByCategory, setTasksByCategory] = useState<
    Record<string, Task[]>
  >({});

  useEffect(() => {
    // Filter out "Unassigned" category and sort by order
    const filteredCategories = boardData.board.categories
      .filter((cat) => cat.name !== "Unassigned")
      .sort((a, b) => a.order - b.order);

    setCategories(filteredCategories);
    setTasksByCategory(boardData.tasksByCategory as Record<string, Task[]>);
  }, []);

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

    setTasksByCategory((prev) => {
      const activeItems = prev[activeContainer] || [];
      const overItems = prev[overContainer!] || [];
      const activeIndex = activeItems.findIndex((t) => t._id === active.id);

      // If dropping on empty category, just append
      if (isCategoryId) {
        return {
          ...prev,
          [activeContainer]: activeItems.filter((t) => t._id !== active.id),
          [overContainer!]: [...overItems, activeItems[activeIndex]],
        };
      }

      // Otherwise, find the position
      const overIndex = overItems.findIndex((t) => t._id === over.id);

      return {
        ...prev,
        [activeContainer]: activeItems.filter((t) => t._id !== active.id),
        [overContainer!]: [
          ...overItems.slice(0, overIndex),
          activeItems[activeIndex],
          ...overItems.slice(overIndex),
        ],
      };
    });
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
