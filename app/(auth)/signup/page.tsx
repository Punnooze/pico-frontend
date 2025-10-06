"use client";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-4 h-full w-full gap-[20px]">
      <div className="col-span-3 bg-tertiary-accent rounded-md" />
      <div className="col-span-1 rounded-md flex flex-col justify-center items-center p-[20px]">
        <div className=" flex flex-col w-full bg-secondary-bg p-[10px] pt-[20px] pb-[20px] rounded-md items-center">
          <h1 className="font-bold mb-[20px]">Login to your account</h1>
          <input
            type="text"
            placeholder="Name"
            className="rounded-md mb-[10px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
          />

          <input
            type="text"
            placeholder="Email"
            className="rounded-md mb-[10px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
          />
          <input
            type="text"
            placeholder="Password"
            className="rounded-md mb-[20px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
          />
          <button className="w-full bg-primary-accent p-[10px] rounded-md text-secondary-bg">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default page;
