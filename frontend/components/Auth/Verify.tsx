"use client";
import { MailCheck } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import LoadingButton from "../Helper/LoadingButton";

const Verify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  console.log(otp);
  const handleChanges = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOpt = [...otp];
      newOpt[index] = value;
      setOtp(newOpt);
    }
    if (value.length === 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Backspace" && !inputRefs.current[index]?.value && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <MailCheck className="w-20 h-20 sm:h-32 sm:w-32 text-blue-500 mb-12" />
      <h1 className="text-2xl  sm:text-3xl font-bold mb-3">OTP Verification</h1>
      <p className="text-sm mb-6 sm:text-base font-medium text-gray-600">We have sent a code to code@example.com</p>
      <div className="flex space-x-4">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          return (
            <input
              type="number"
              maxLength={1}
              key={index}
              className="w-10 h-10 sm:h-24 sm:w-24 bg-gray-200 text-center rounded-lg text-lg sm:text-4xl font-bold outline-gray-500 no-spinner"
              value={otp[index] || ""}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onChange={(e) => handleChanges(index, e)}
            />
          );
        })}
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <h3 className="text-sm sm:text-lg font-medium text-gray-700">Didn&apos;t get the otp?</h3>
        <button className="text-sm sm:text-lg font-medium text-blue-900 underline">Resend code</button>
      </div>
      <LoadingButton isLoading={isLoading} size={"lg"} className="mt-6 w-52">
        Verify
      </LoadingButton>
    </div>
  );
};

export default Verify;
