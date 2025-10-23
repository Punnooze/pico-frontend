import React, { useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
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

function Categories() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(tasksData.tasks as Task[]);
  }, []);

  const getTaskPos = (id: string) => tasks.findIndex((task) => task._id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id as string);
      const newPos = getTaskPos(over.id as string);

      return arrayMove(tasks, originalPos, newPos);
    });
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
        collisionDetection={closestCorners}
      >
        <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
          <SortableContext
            items={tasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskComponent task={task} key={task._id} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 2
      </div>
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 3
      </div>
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 4
      </div>
    </div>
  );
}

export default Categories;
