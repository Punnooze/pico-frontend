import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "./UnassignedTasks";
import {
  SortableContext,
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

interface CategoriesProps {
  categories: Category[];
  tasksByCategory: Record<string, Task[]>;
}

function Categories({ categories, tasksByCategory }: CategoriesProps) {
  return (
    <div className="flex gap-4 min-w-max">
      {categories.map((category) => {
        const categoryTasks = tasksByCategory[category.id] || [];

        return (
          <DroppableColumn key={category.id} id={category.id}>
            <div className="w-[220px] bg-primary-bg/70 rounded-md overflow-clip h-full flex flex-col">
              <div
                className="font-bold mb-2 p-[10px] flex justify-start"
                style={{ backgroundColor: category.color }}
              >
                <h3>{category.name}</h3>
              </div>
              <div className="p-[10px] flex-1 min-h-[200px]">
                <SortableContext
                  items={categoryTasks.map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categoryTasks.map((task) => (
                    <TaskComponent
                      task={task}
                      key={task._id}
                      borderColor={category.color}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </DroppableColumn>
        );
      })}
    </div>
  );
}

export default Categories;
