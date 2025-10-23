import { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";

export interface Task {
  _id: string;
  name: string;
  taskId: string;
  description: string;
  boardId: string;
  categoryId: string;
  boardName: string;
  categoryName: string;
  priority: "high" | "medium" | "low";
  status: string;
  assignee: string | null;
  dueDate: string;
  tags: string[];
  timeEstimate: string;
  size: "S" | "M" | "LG" | "XL" | "XXL";
  jiraTicket?: string;
  createdAt: string;
  updatedAt: string;
}

interface UnassignedTasksProps {
  task: Task;
}

function UnassignedTasks({ task }: UnassignedTasksProps) {
  const [componentInFocus, setComponentInFocus] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [truncatedDescription, setTruncatedDescription] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (task.description != null) {
      if (task.description.length <= 30) {
        setTruncatedDescription(task.description);
      } else {
        var croppedDescription = task.description.substring(0, 27);
        if (croppedDescription.charAt(26) == " ") {
          croppedDescription = croppedDescription.substring(0, 26);
        }
        setTruncatedDescription(croppedDescription + "...");
      }
    }
  }, [task]);

  const handleClick = () => {
    if (isSelected) {
      // If already selected, dismiss immediately
      setIsSelected(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // If not selected, select and start timer
      setIsSelected(true);

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Start new 3-second timer
      timerRef.current = setTimeout(() => {}, 2000);
    }
  };

  const handleMouseEnter = () => {
    // Clear any existing hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    // Show checkbox immediately on hover
    setComponentInFocus(true);
  };

  const handleMouseLeave = () => {
    // Start delay before hiding
    hoverTimerRef.current = setTimeout(() => {
      setComponentInFocus(false);
    }, 100);
  };

  return (
    <div
      className="flex flex-col justify-start items-center bg-primary-bg/60 p-[10px] rounded-md w-full mb-[10px] text-[15px] px-[15px] cursor-pointer  hover:bg-primary-bg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex w-full">
        <button
          onClick={handleClick}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out mr-3 cursor-pointer ${
            componentInFocus || isSelected
              ? "opacity-100 scale-100 block"
              : "opacity-0 scale-90  hidden"
          } ${
            isSelected
              ? "bg-primary-accent border-primary-accent"
              : "bg-transparent border-primary-text/40"
          }`}
        >
          {isSelected && <FaCheck className="w-3 h-3 text-white" />}
        </button>
        <p
          className={`${
            componentInFocus ? "text-primary-text" : " text-primary-text"
          }`}
        >
          {task.name}
        </p>
      </div>
      <div
        className={`text-[14px] mt-[5px] transition-all duration-300 ease-in-out text-secondary-text ${
          componentInFocus ? "block" : "hidden"
        }`}
      >
        {truncatedDescription}
      </div>
    </div>
  );
}

export default UnassignedTasks;
