"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import PasswordInput from "./PasswordInput";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  console.log(email);
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Reset your password</h1>
      <p className="text-sm sm:text-base text-gray-600 text-center font-medium mb-3">
        Enter you otp and new password to reset your password
      </p>
      <input
        type="number"
        placeholder="Enter Otp"
        className="py-3.5 px-6 rounded-lg bg-gray-200 block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto no-spinner outline-none mb-3"
      />
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <PasswordInput
          name="password"
          placeholder="Enter New Password"
          inputClassName="py-3 px-6 rounded-lg bg-gray-200 outline-none mb-3"
        />
      </div>
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <PasswordInput
          name="passwordconfirm"
          placeholder="Confirm Password"
          inputClassName="py-3 px-6 rounded-lg bg-gray-200 outline-none"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
