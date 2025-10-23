"use client";

import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import tasksData from "@/utils/tasks.json";
import { BsInboxesFill } from "react-icons/bs";
import UnassignedTasks, { Task } from "./UnassignedTasks";

function Inbox() {
  const board = useAppSelector((state) => state.boards.currentBoard);
  const [unassignedTasks, SetUnassignedTasks] = useState<Task[]>([]);
  const tasks = tasksData.tasks as Task[];

  return (
    <div className="flex items-center flex-col w-full">
      <div className="bg-primary-bg/30 w-full flex justify-center items-center p-[17px] border-primary-bg border-b-[2px]">
        <BsInboxesFill />
        <p className="ml-[5px]">Inbox</p>
      </div>
      <div className="w-full p-[10px]">
        <div className="w-full">
          {tasks.map((task) => {
            return <UnassignedTasks key={task.taskId} task={task} />;
          })}
        </div>
        <div className="flex justify-center items-center bg-primary-bg/60 p-[10px] rounded-md w-full mt-[10px]">
          <IoIosAdd />
          <p>Create Task</p>
        </div>
      </div>
    </div>
  );
}

export default Inbox;
