import React, { useEffect, useRef, useState } from "react";
import type { Task } from "./UnassignedTasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoMdArrowRoundForward } from "react-icons/io";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { MdTaskAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import { SiJira } from "react-icons/si";

interface TaskComponentProps {
  task: Task;
}

function TaskComponent({ task }: TaskComponentProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });
  const [userInitials, setUserInitials] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("in handle click");
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

  function formatDate(date: string): string {
    const dateObj = new Date(date);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear().toString().slice(-2);

    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    if (task.assignee) {
      const nameArray = task.assignee.split(" ");
      if (nameArray.length >= 2)
        setUserInitials(
          nameArray[0].charAt(0).toUpperCase() +
            nameArray[1].charAt(0).toUpperCase()
        );
    }
  }, [task]);

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
      className="mb-[20px] t touch-none cursor-pointer bg-secondary-bg p-[10px] rounded-md border-primary-accent border-l-[3px] hover:-z-50"
    >
      <div className="flex flex-col items-baseline">
        <div className="flex">
          <button
            onClick={handleClick}
            onPointerDown={(e) => e.stopPropagation()}
            className={`mt-[5px] w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer opacity-100 scale-100 mr-[5px]
           ${
             isSelected
               ? "bg-primary-accent border-primary-accent"
               : "bg-transparent border-primary-text/40"
           }`}
          >
            {isSelected && <FaCheck className="w-3 h-3 text-white" />}
          </button>
          <p className="text-[15px] font-bold"> {task.name}</p>
        </div>
        {/* pills */}
        {task.tags.length !== 0 && (
          <div className="flex flex-wrap gap-[5px] mt-[7px]">
            {task.tags.map((tag, index) => (
              <div
                key={index}
                className="p-[3px] px-[7px] bg-secondary-accent rounded-lg"
              >
                <p className="text-[11px] font-bold">{tag}</p>
              </div>
            ))}
          </div>
        )}

        <div className="  flex items-center mt-[10px]">
          <div className="flex gap-[5px] items-center  p-[5px] rounded-md bg-primary-bg/50">
            <FaRegCalendarAlt />
            <p className="text-[13px]">{formatDate(task.createdAt)}</p>
          </div>
          <IoMdArrowRoundForward />
          <div className=" flex gap-[5px] items-center  p-[5px] rounded-md bg-primary-bg/50">
            <FaRegCalendarAlt />
            <p className="text-[13px]">{formatDate(task.dueDate)}</p>
          </div>
        </div>
        <div className="mt-[10px] flex gap-[20px] px-[10px] items-center">
          {task.assignee !== null && (
            <div className="flex items-center gap-[10px]">
              <p className="bg-primary-accent rounded-full p-[9px] text-[10px]">
                {userInitials}
              </p>
            </div>
          )}
          <div>
            {task.priority == "high" ? (
              <FaChevronUp className="text-red-500" />
            ) : task.priority == "medium" ? (
              <TbBaselineDensityMedium className=" text-blue-700" />
            ) : (
              <FaChevronDown className=" text-amber-500" />
            )}
          </div>
          <p className="p-[3px] px-[7px] bg-secondary-accent rounded-lg text-[11px] font-bold">
            {task.size.toUpperCase()}
          </p>
        </div>
        <div className="flex justify-between w-full">
          <div
            className="flex items-center gap-[5px] mt-[20px] border-b-[1px] border-secondary-bg cursor-pointer hover:border-primary-accent transition-all duration-100"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `/task/${task.taskId}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <MdTaskAlt className="text-[17px] text-secondary-accent" />
            <p className="text-[14px] hover:text-secondary-accent duration-100 transition-all">
              {task.taskId}
            </p>
          </div>
          {task.jiraTicket && (
            <div
              className="flex items-center gap-[5px] mt-[20px] border-b-[1px] border-secondary-bg cursor-pointer hover:border-primary-accent transition-all duration-100"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                console.log(task.jiraTicket);
                window.open(
                  task.jiraTicket || "",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <SiJira className="text-[15px] text-primary-accent" />
              <p className="text-[14px] hover:text-primary-accent duration-100 transition-all">
                {task.jiraTicket.split("/").pop()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskComponent;
