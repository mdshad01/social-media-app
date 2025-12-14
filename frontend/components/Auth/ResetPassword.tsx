"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../util/apiRequest";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!otp || !password || !passwordConfirm) {
      return;
    }

    const data = { email, otp, password, passwordConfirm };
    const resetPassReq = async () =>
      axios.post(`${BASE_API_URL}/users/reset-password`, data, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(resetPassReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      router.push("/auth/login");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
        Reset your password
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground text-center font-medium mb-3">
        Enter you otp and new password to reset your password
      </p>
      <input
        type="number"
        placeholder="Enter Otp"
        className="py-3.5 px-6 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto no-spinner outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <PasswordInput
          name="password"
          placeholder="Enter New Password"
          inputClassName="py-3 px-6 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <PasswordInput
          name="passwordconfirm"
          placeholder="Confirm Password"
          inputClassName="py-3 px-6 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="flex space-x-4 items-center mt-6">
        <LoadingButton onClick={handleSubmit} isLoading={isLoading} size={"lg"}>
          Change Password
        </LoadingButton>
        <Button variant={"ghost"} size={"lg"}>
          <Link href="/auth/forget-password">Go Back</Link>
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
