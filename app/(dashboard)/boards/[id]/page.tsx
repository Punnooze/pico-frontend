"use client";
import { useEffect, useState } from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { BsInboxesFill } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { boardFetchByIdRequest } from "@/redux/actions/boards.actions";
import { getCustomerDetailsRequest } from "@/redux/actions/customers.actions";
import { jwtDecode } from "jwt-decode";
import { BsFillKanbanFill } from "react-icons/bs";
import { FaTableList } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BoardContent from "@/components/BoardContent";

interface AccessTokenPayload {
  name: string;
  email: string;
  customerId: string;
  iat?: number;
}

function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [boardOpen, setBoardOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  const loading = useAppSelector((state) => state.boards.loading);
  const error = useAppSelector((state) => state.boards.error);
  const [view, setView] = useState("Board");

  // Fetch customer details on mount
  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      const decoded = jwtDecode<AccessTokenPayload>(token);
      dispatch(getCustomerDetailsRequest(decoded.customerId));
    }
  }, [dispatch]);

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
    <div className={`flex flex-col  h-full relative`}>
      {!loading ? (
        <>
          <div className="bg-primary-accent p-[10px] flex items-center rounded-md">
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
            {/* {sidebarOpen && boardOpen && (
              <FaCircleChevronLeft
                onClick={() => setSidebarOpen(false)}
                className="ml-auto text-[20px] cursor-pointer"
              />
            )} */}
          </div>

          <div className="h-[80vh] w-full overflow-x-auto overflow-y-auto py-[10px]  rounded-md">
            <BoardContent sidebarOpen={sidebarOpen} boardOpen={boardOpen} />
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
