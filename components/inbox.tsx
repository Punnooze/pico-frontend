"use client";

import { IoIosAdd } from "react-icons/io";
import { BsInboxesFill } from "react-icons/bs";
import UnassignedTasks, { Task } from "./UnassignedTasks";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface InboxProps {
  tasks: Task[];
}

function Inbox({ tasks }: InboxProps) {
  const { setNodeRef } = useDroppable({ id: "unassigned" });

  return (
    <div className="flex items-center flex-col w-full h-full bg-secondary-bg rounded-lg">
      <div className="bg-primary-bg/30 w-full flex justify-center items-center p-[17px] border-primary-bg border-b-[2px]">
        <BsInboxesFill />
        <p className="ml-[5px]">Inbox</p>
      </div>
      <div className="w-full p-[10px]" ref={setNodeRef}>
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="w-full">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                return <UnassignedTasks key={task._id} task={task} />;
              })
            ) : (
              <p className="text-secondary-text text-sm text-center p-4">
                No unassigned tasks
              </p>
            )}
          </div>
        </SortableContext>
        <div className="flex justify-center items-center bg-primary-bg/60 p-[10px] rounded-md w-full mt-[10px] cursor-pointer hover:bg-primary-bg transition-all">
          <IoIosAdd />
          <p>Create Task</p>
        </div>
      </div>
    </div>
  );
}

export default Inbox;
