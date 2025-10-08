"use client";
import { getCustomerDetailsRequest } from "@/redux/actions/customers.actions";
import { loginRequest } from "@/redux/actions/login.action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("aditis@gmail.com");
  const [password, setPassword] = useState("iloveyou");

  const token = useAppSelector((state) => state.login.token);
  const loading = useAppSelector((state) => state.login.loading);
  const error = useAppSelector((state) => state.login.error);

  const handleLogin = () => {
    console.log("dispatching", { email, password, loading });
    dispatch(loginRequest(email, password));
  };

  useEffect(() => {
    if (token !== null) {
      router.push("/boards");
    }
  }, [token]);

  useEffect(() => {
    if (error !== null) {
      alert(`Error Getting customer details: ${error}`);
    }
  }, [error]);

  return (
    <div className="grid grid-cols-4 h-full w-full gap-[20px]">
      <div className="col-span-3 bg-primary-accent/50 rounded-md" />
      <div className="col-span-1 rounded-md flex flex-col justify-center items-center ">
        <div className=" flex flex-col w-full bg-secondary-bg p-[10px] pt-[40px] pb-[40px] rounded-md items-center">
          <h1 className="font-bold mb-[20px]">Login to your account</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            className="rounded-lg mb-[10px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
            onChange={(value) => setEmail(value.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            className="rounded-lg mb-[20px] p-[10px] bg-primary-bg border-2 border-secondary-bg  focus:border-secondary-accent outline-none w-full"
            onChange={(value) => setPassword(value.target.value)}
          />
          <button
            className="w-full bg-secondary-accent p-[10px] rounded-md  text-primary-text cursor-pointer"
            onClick={() => {
              handleLogin();
            }}
            disabled={loading}
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
