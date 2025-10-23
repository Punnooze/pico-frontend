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
import tasksData from "@/utils/tasks.json";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskComponent from "./TaskComponent";

type ColumnId = "column1" | "column2";

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
  const [columns, setColumns] = useState<Record<ColumnId, Task[]>>({
    column1: [],
    column2: [],
  });

  useEffect(() => {
    setColumns({
      column1: tasksData.tasks as Task[],
      column2: [],
    });
  }, []);

  const findContainer = (id: string): ColumnId | null => {
    if (columns.column1.find((task) => task._id === id)) return "column1";
    if (columns.column2.find((task) => task._id === id)) return "column2";
    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id as string);

    // Check if over.id is a column container (for empty columns)
    let overContainer: ColumnId | null = null;
    if (over.id === "column1" || over.id === "column2") {
      overContainer = over.id as ColumnId;
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

    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer!];
      const activeIndex = activeItems.findIndex((t) => t._id === active.id);

      // If dropping on empty column, just append
      if (over.id === "column1" || over.id === "column2") {
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

    // Check if over.id is a column container
    let overContainer: ColumnId | null = null;
    if (over.id === "column1" || over.id === "column2") {
      overContainer = over.id as ColumnId;
    } else {
      overContainer = findContainer(over.id as string);
    }

    if (!activeContainer || !overContainer) return;

    // If dropping on column container (empty column), no reordering needed
    if (over.id === "column1" || over.id === "column2") {
      return;
    }

    // Reorder within same column
    if (activeContainer === overContainer) {
      setColumns((prev) => {
        const items = prev[activeContainer];
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
        <DroppableColumn id="column1">
          <div className="w-[240px] bg-primary-bg/70 rounded-md min-h-[200px] overflow-clip">
            <div className="font-bold mb-2 p-[10px] bg-secondary-accent flex justify-start ">
              <h3>Column 1</h3>
            </div>
            <div className="p-[10px] ">
              <SortableContext
                items={columns.column1.map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                {columns.column1.map((task) => (
                  <TaskComponent task={task} key={task._id} />
                ))}
              </SortableContext>
            </div>
          </div>
        </DroppableColumn>

        <DroppableColumn id="column2">
          <div className="w-[240px] bg-primary-bg/70 rounded-md min-h-[200px] overflow-clip">
            <div className="font-bold mb-2 p-[10px] bg-secondary-accent flex justify-start ">
              <h3>Column 2</h3>
            </div>
            <div className="p-[10px] ">
              <SortableContext
                items={columns.column2.map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                {columns.column2.map((task) => (
                  <TaskComponent task={task} key={task._id} />
                ))}
              </SortableContext>
            </div>
          </div>
        </DroppableColumn>
      </DndContext>
      <div className="w-[250px] bg-secondary-accent p-4 rounded-md">
        <h3 className="font-bold mb-2">Column 3</h3>
      </div>
      <div className="w-[250px] bg-secondary-accent p-4 rounded-md">
        <h3 className="font-bold mb-2">Column 4</h3>
      </div>
    </div>
  );
}

export default Categories;
