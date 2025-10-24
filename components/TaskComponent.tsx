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
import { IoPersonSharp } from "react-icons/io5";

interface TaskComponentProps {
  task: Task;
  borderColor: string;
}

function TaskComponent({ task, borderColor }: TaskComponentProps) {
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
    borderLeft: `3px solid ${borderColor}`,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mb-[20px] touch-none cursor-pointer bg-secondary-bg p-[10px] rounded-md hover:-z-50"
    >
      <div className="flex flex-col items-baseline">
        <div className="flex">
          <button
            onClick={handleClick}
            onPointerDown={(e) => e.stopPropagation()}
            className={`mt-[5px] w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer opacity-100 scale-100 mr-[5px]
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
          <div className="flex flex-wrap gap-[5px] mt-[10px]">
            {task.tags.map((tag, index) => (
              <div
                key={index}
                className="p-[3px] px-[7px] rounded-md border-[1.5px]"
                style={{
                  backgroundColor: `${tag.color}1A`, // 70% opacity in hex (1A ≈ 10% which looks good, B3 for 70%)
                  borderColor: tag.color,
                }}
              >
                <p
                  className="text-[9px] font-bold"
                  style={{ color: tag.color }}
                >
                  {tag.name}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-baseline gap-[30px] w-full mt-[10px]">
          <div className="  flex gap-[5px] px-[10px] items-center  p-[5px] rounded-md bg-secondary-text/20 border-secondary-text border-[2px]">
            <FaRegCalendarAlt />
            <p className="text-[14px]">{task.dueDate}</p>
          </div>
          <div>
            {task.priority == "high" ? (
              <FaChevronUp className="text-red-500" />
            ) : task.priority == "medium" ? (
              <TbBaselineDensityMedium className=" text-blue-700" />
            ) : (
              <FaChevronDown className=" text-amber-500" />
            )}
          </div>
        </div>

        <div className="mt-[10px] flex gap-[20px] items-center w-full">
          {task.assignee !== null && (
            <div className="flex items-center gap-[5px] bg-primary-accent/20 border-[2px] border-primary-accent  rounded-md px-[10px] p-[5px]">
              <IoPersonSharp className=" text-[13px] text-bright-blue" />
              <p className="  text-[13px] hover:text-bright-blue">
                {task.assignee}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-between w-full">
          <div
            className="flex items-center gap-[5px] mt-[20px] border-b-[1px] border-secondary-bg cursor-pointer hover:border-secondary-accent transition-all duration-100"
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
            <p className="text-[14px] text-secondary-accent duration-100 transition-all">
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
              <p className="text-[14px] text-bright-blue duration-100 transition-all">
                {task.jiraTicket.split("/").pop()}
              </p>
            </div>
          )}
        </div>
        {/* <div className=" flex gap-[5px] items-center"> */}

        <p className="text-[12px] mt-[15px] text-secondary-text font-light">
          Last updated : {formatDate(task.dueDate)}
        </p>
        {/* </div> */}
      </div>
    </div>
  );
}

export default TaskComponent;
