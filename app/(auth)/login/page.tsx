"use client";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-4 h-full w-full gap-[20px]">
      <div className="col-span-3 bg-primary-accent/50 rounded-md" />
      <div className="col-span-1 rounded-md flex flex-col justify-center items-center ">
        <div className=" flex flex-col w-full bg-secondary-bg p-[10px] pt-[40px] pb-[40px] rounded-md items-center">
          <h1 className="font-bold mb-[20px]">Login to your account</h1>
          <input
            type="text"
            placeholder="Email"
            className="rounded-lg mb-[10px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
          />
          <input
            type="text"
            placeholder="Password"
            className="rounded-lg mb-[20px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
          />
          <button
            className="w-full bg-secondary-accent p-[10px] rounded-md  text-primary-text"
            onClick={() => router.push("/boards")}
          >
            Login
          </button>
          <p className="text-secondary-text text-center text-[14px] mt-[20px]">
            <span
              className="text-secondary-accent hover:underline cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>{" "}
            instead
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
