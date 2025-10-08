"use client";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

function Navbar() {
  const [customerInitial, setCustomerInitial] = useState("");
  const customerDetails = useAppSelector(
    (state) => state.customers.customerDetails
  );
  useEffect(() => {
    console.log("customer details:", customerDetails);
    if (customerDetails) {
      const nameArray = customerDetails.name.split(" ");
      if (nameArray.length >= 2)
        setCustomerInitial(
          nameArray[0].charAt(0).toUpperCase() +
            nameArray[1].charAt(0).toUpperCase()
        );
    }
  }, [customerDetails]);
  return (
    <div className="border-b border-secondary-bg px-[20px] py-[10px] flex justify-between items-center">
      <div className="flex items-center gap-[5px] bg-secondary-bg w-fit rounded-[5px] px-[10px] py-[7px]">
        <p className="text-secondary-accent font-bold">P</p>
        <p className="text-primary-text font-bold">Pico</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search"
          className="bg-primary-bg border-2 border-secondary-bg rounded-lg px-[10px] py-[5px] w-[500px] outline-none"
        />
        <button
          className="bg-primary-accent text-primary-text rounded-[5px] px-[10px] py-[5px] ml-[10px] hover:bg-primary-accent/80"
          onClick={() => {}}
        >
          Search
        </button>
      </div>
      <div className="rounded-full bg-primary-accent w-[40px] h-[40px] flex items-center justify-center">
        {customerInitial}
      </div>
    </div>
  );
}

export default Navbar;
