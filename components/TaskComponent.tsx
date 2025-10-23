import React from "react";
import type { Task } from "./UnassignedTasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskComponentProps {
  task: Task;
}

function TaskComponent({ task }: TaskComponentProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mb-[20px] bg-primary-accent touch-none cursor-pointer"
    >
      <div className="flex">
        <input type="checkbox" />
        <p> {task.name}</p>
      </div>
      <p className="text-[12px]"> {task.description}</p>
    </div>
  );
}

export default TaskComponent;
