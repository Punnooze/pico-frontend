"use client";

import React, { useEffect } from "react";
import { IoIosStarOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { boardsFetchRequest } from "@/redux/actions/boards.actions";
import { getCustomerDetailsRequest } from "@/redux/actions/customers.actions";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Board } from "@/redux/network/boards.api";

interface AccessTokenPayload {
  name: string;
  email: string;
  customerId: string;
  iat?: number;
}

function Page() {
  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards.boards);
  const loading = useAppSelector((state) => state.boards.loading);
  const error = useAppSelector((state) => state.boards.error);
  const router = useRouter();
  const customerDetails = useAppSelector(
    (state) => state.customers.customerDetails
  );
  const customerLoading = useAppSelector((state) => state.customers.loading);
  const customerError = useAppSelector((state) => state.customers.error);

  const starred = false;

  const handleBoardSelect = (board: Board) => {
    console.log(board);
    router.push(`/boards/${board._id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      const decoded = jwtDecode<AccessTokenPayload>(token);
      dispatch(getCustomerDetailsRequest(decoded.customerId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (customerDetails) {
      dispatch(boardsFetchRequest());
    }
  }, [customerDetails]);

  return (
    <div className="grid grid-cols-5 h-full w-full">
      <div className="col-span-1 border-r border-secondary-bg p-[20px]">
        <div></div>
      </div>
      <div className="col-span-4 p-[20px] flex flex-col mr-[100px]">
        <h1 className="font-bold text-[20px]">Your Boards</h1>

        {loading ||
          (customerLoading && (
            <div className="flex items-center justify-center mt-[40px]">
              <div className="text-[18px]">Loading boards...</div>
            </div>
          ))}

        {error && (
          <div className="flex items-center justify-center mt-[40px]">
            <div className="text-red-500 text-[18px]">Error: {error}</div>
          </div>
        )}

        {!loading && !error && !customerLoading && !customerError && (
          <div className="grid grid-cols-4 gap-[20px] mt-[40px]">
            {boards.map((board, index) => (
              <div
                key={index}
                className="rounded-md h-[170px] flex flex-col group cursor-pointer"
                onClick={() => handleBoardSelect(board)}
              >
                <div className="h-[70%] w-full rounded-md rounded-b-none p-[10px] flex justify-end bg-secondary-accent">
                  <IoIosStarOutline
                    className={`text-primary-text size-[25px] font-extralight transition-opacity duration-100 ${
                      starred
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <div className="bg-secondary-bg h-[30%] w-full rounded-md rounded-t-none flex items-center pl-[10px]">
                  {board.name}
                </div>
              </div>
            ))}

            <button
              className="cursor-pointer rounded-md h-[170px] bg-secondary-bg flex items-center justify-center hover:bg-secondary-bg/80 transition-colors"
              onClick={() => {}}
            >
              <span className="text-[22px] font-bold mr-[10px]">+</span>Create
              Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
