import React from "react";
import { IoIosStarOutline } from "react-icons/io";

function Page() {
  return (
    <div className="grid grid-cols-5 h-full w-full">
      <div className="col-span-1 border-r border-secondary-bg p-[20px]">
        <div></div>
      </div>
      <div className="col-span-4 p-[20px] flex flex-col mr-[100px]">
        <h1 className="font-bold text-[20px]">Your Boards</h1>
        <div className="grid grid-cols-3 gap-[20px] mt-[40px]">
          <div className="rounded-md h-[170px] flex flex-col group cursor-pointer">
            <div className="bg-primary-accent h-[70%] w-full rounded-md rounded-b-none p-[10px] flex justify-end">
              <IoIosStarOutline className="text-primary-text size-[25px] font-extralight opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
            </div>
            <div className="bg-secondary-bg h-[30%] w-full rounded-md rounded-t-none flex items-center pl-[10px]">
              Hello
            </div>
          </div>
          <div className="rounded-md h-[170px] bg-secondary-bg flex items-center justify-center cursor-pointer hover:bg-secondary-bg/80 transition-colors">
            <div>
              <span className="text-[22px] font-bold mr-[10px]">+</span>Create
              Board
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
