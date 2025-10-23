"use client";
import { useEffect, useState } from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { BsInboxesFill } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { boardFetchByIdRequest } from "@/redux/actions/boards.actions";
import { BsFillKanbanFill } from "react-icons/bs";
import { FaTableList } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Inbox from "@/components/inbox";
import Categories from "@/components/Categories";

function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  const loading = useAppSelector((state) => state.boards.loading);
  const error = useAppSelector((state) => state.boards.error);
  const [view, setView] = useState("Board");

  useEffect(() => {
    if (!boardOpen && !sidebarOpen) {
      setBoardOpen(true);
    }
  }, [boardOpen, sidebarOpen]);

  useEffect(() => {
    const boardId = pathname.split("/").pop();
    if (boardId) {
      dispatch(boardFetchByIdRequest(boardId));
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    if (error !== null) {
      router.push("/boards");
    }
  }, [error, router]);
  return (
    <div className={`flex flex-col gap-[20px] h-full relative `}>
      {!loading ? (
        <>
          <div className="flex h-full w-full">
            <div className="grid-cols-5 grid h-full w-full gap-[10px]">
              {sidebarOpen && (
                <div
                  className={`relative bg-secondary-bg rounded-md  ${
                    boardOpen ? "" : "col-span-5"
                  }`}
                >
                  {boardOpen && (
                    <FaCircleChevronLeft
                      onClick={() => setSidebarOpen(false)}
                      className="absolute right-[-10px] top-[50px] text-[20px] text-tertiary-accent cursor-pointer "
                    />
                  )}
                  <Inbox />
                </div>
              )}
              {boardOpen && (
                <div
                  className={`${
                    sidebarOpen ? "col-span-4" : "col-span-5"
                  } bg-secondary-bg rounded-md overflow-clip`}
                >
                  <div className="bg-primary-accent p-[10px] flex items-center ">
                    <span>{currentBoard?.name || "Loading..."}</span>
                    <Select value={view} onValueChange={setView}>
                      <SelectTrigger className="ml-[10px] hover:bg-bright-blue shadow-none border-none outline-none rounded-sm p-[10px] w-auto">
                        <div className="flex items-center">
                          {view === "Board" ? (
                            <BsFillKanbanFill className="size-4 text-text-primary-text" />
                          ) : (
                            <FaTableList className="size-4 text-text-primary-text" />
                          )}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-primary-bg border-none outline-none text-text-secondary-text">
                        <SelectItem value="Board">
                          <div className="flex items-center gap-2">
                            <BsFillKanbanFill className="size-4 text-text-primary-text" />
                            <span>Board</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="List">
                          <div className="flex items-center gap-2">
                            <FaTableList className="size-4 text-text-primary-text" />
                            <span>List</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[80vh] w-full overflow-x-auto overflow-y-auto p-[20px]">
                    <Categories />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-[10px] w-[230px] bg-primary-bg p-[10px] border border-primary-text/20 rounded-lg  left-[50%] -translate-x-1/2 grid grid-cols-2 gap-[10px]">
            <div
              className={`flex items-center justify-center rounded-lg gap-[5px] cursor-pointer px-[5px] py-[7px] border-[2px] ${
                sidebarOpen
                  ? "bg-primary-accent/10 text-bright-blue border-primary-accent "
                  : " border-primary-bg"
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <BsInboxesFill />
              Inbox
            </div>
            <div
              className={`flex items-center justify-center rounded-lg gap-[5px] cursor-pointer px-[5px] py-[7px] border-[2px] ${
                boardOpen
                  ? "bg-primary-accent/10 text-bright-blue border-primary-accent "
                  : " border-primary-bg"
              }`}
              onClick={() => setBoardOpen(!boardOpen)}
            >
              <MdDashboard />
              Board
            </div>
          </div>
        </>
      ) : (
        <p>Fetching details...</p>
      )}
    </div>
  );
}

export default Page;
