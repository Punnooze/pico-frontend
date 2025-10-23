"use client";

import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import boardData from "@/utils/boardData.json";
import { BsInboxesFill } from "react-icons/bs";
import UnassignedTasks, { Task } from "./UnassignedTasks";

function Inbox() {
  const board = useAppSelector((state) => state.boards.currentBoard);
  const [unassignedTasks, SetUnassignedTasks] = useState<Task[]>([]);
  // Get tasks from "Unassigned" category
  const tasks = (boardData.tasksByCategory.unassigned || []) as Task[];

  return (
    <div className="flex items-center flex-col w-full">
      <div className="bg-primary-bg/30 w-full flex justify-center items-center p-[17px] border-primary-bg border-b-[2px]">
        <BsInboxesFill />
        <p className="ml-[5px]">Inbox</p>
      </div>
      <div className="w-full p-[10px]">
        <div className="w-full">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              return <UnassignedTasks key={task.taskId} task={task} />;
            })
          ) : (
            <p className="text-secondary-text text-sm text-center p-4">
              No unassigned tasks
            </p>
          )}
        </div>
        <div className="flex justify-center items-center bg-primary-bg/60 p-[10px] rounded-md w-full mt-[10px] cursor-pointer hover:bg-primary-bg transition-all">
          <IoIosAdd />
          <p>Create Task</p>
        </div>
      </div>
    </div>
  );
}

export default Inbox;
