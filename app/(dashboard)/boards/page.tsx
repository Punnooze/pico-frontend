/**
 * BOARDS PAGE - USING REDUX
 *
 * This component demonstrates how to use Redux in a React component.
 * It shows the complete flow:
 * 1. Dispatching an action when component mounts
 * 2. Reading state from the Redux store
 * 3. Displaying loading/error states
 * 4. Rendering data from the store
 */

"use client"; // Required for Next.js App Router when using hooks

import React, { useEffect } from "react";
import { IoIosStarOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { boardsFetchRequest } from "@/redux/actions/boards.actions";

function Page() {
  /**
   * REDUX HOOKS
   *
   * useAppDispatch: Returns the dispatch function
   * - Used to dispatch actions to the Redux store
   * - Actions flow: Component -> Saga -> Reducer -> Store
   */
  const dispatch = useAppDispatch();

  /**
   * useAppSelector: Extracts data from the Redux store
   * - Takes a selector function: (state) => value
   * - Re-renders component when selected data changes
   * - Access nested state: state.boards.boards, state.boards.loading, etc.
   */
  const boards = useAppSelector((state) => state.boards.boards);
  const loading = useAppSelector((state) => state.boards.loading);
  const error = useAppSelector((state) => state.boards.error);

  /**
   * FETCHING DATA ON COMPONENT MOUNT
   *
   * useEffect with empty dependency array [] runs once when component mounts
   * This is the perfect place to fetch initial data
   *
   * Flow:
   * 1. Component mounts
   * 2. Dispatch BOARDS_FETCH_REQUEST action
   * 3. Saga catches the action and calls API
   * 4. Saga dispatches BOARDS_FETCH_SUCCESS or FAILURE
   * 5. Reducer updates state
   * 6. Component re-renders with new data
   */
  useEffect(() => {
    // TODO: Replace 'user123' with actual userId from auth
    // You might get this from a user context or auth provider
    const userId = "user123";

    // Dispatch the action to fetch boards
    dispatch(boardsFetchRequest(userId));
  }, []); // Empty array means run once on mount

  /**
   * CONDITIONAL RENDERING
   * Show different UI based on Redux state
   */

  return (
    <div className="grid grid-cols-5 h-full w-full">
      <div className="col-span-1 border-r border-secondary-bg p-[20px]">
        <div></div>
      </div>
      <div className="col-span-4 p-[20px] flex flex-col mr-[100px]">
        <h1 className="font-bold text-[20px]">Your Boards</h1>

        {/* Loading State: Show while fetching data */}
        {loading && (
          <div className="flex items-center justify-center mt-[40px]">
            <div className="text-[18px]">Loading boards...</div>
          </div>
        )}

        {/* Error State: Show if API call failed */}
        {error && (
          <div className="flex items-center justify-center mt-[40px]">
            <div className="text-red-500 text-[18px]">Error: {error}</div>
          </div>
        )}

        {/* Success State: Show boards when loaded */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-[20px] mt-[40px]">
            {/* Map over boards from Redux store */}
            {boards.map((board) => (
              <div
                key={board.id}
                className="rounded-md h-[170px] flex flex-col group cursor-pointer"
              >
                <div
                  className="h-[70%] w-full rounded-md rounded-b-none p-[10px] flex justify-end"
                  style={{ backgroundColor: board.color }}
                >
                  <IoIosStarOutline
                    className={`text-primary-text size-[25px] font-extralight transition-opacity duration-100 ${
                      board.starred
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

            {/* Create Board Button */}
            <div className="rounded-md h-[170px] bg-secondary-bg flex items-center justify-center cursor-pointer hover:bg-secondary-bg/80 transition-colors">
              <div>
                <span className="text-[22px] font-bold mr-[10px]">+</span>Create
                Board
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
