"use client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "../util/apiRequest";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const loginReq = async () => axios.post(`${BASE_API_URL}/users/login`, formData, { withCredentials: true });
    const result = await handleAuthRequest(loginReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="flex flex-col lg:flex-row ">
        {/* Banner */}
        <div className="lg:w-[55%] h-screen hidden lg:block">
          <Image src="/Banner3.jpg" alt="signup" width={1000} height={1000} className="w-full h-full object-cover" />
        </div>
        {/* Form */}
        <div className="flex flex-col lg:w-[45%] items-center justify-center h-screen ">
          <h1 className="font-bold text-xl sm:text-2xl uppercase mb-8">
            Login with <span className="text-blue-500">ShadSocial</span>
          </h1>
          <form onSubmit={handleSubmit} className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]">
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                placeholder="email address"
                className="px-4 py-4 w-full rounded-lg bg-gray-200 block outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
              <Link
                href="/auth/forget-password"
                className="text-blue-500 mt-2 font-semibold text-base cursor-pointer text-right block">
                Forget Password?
              </Link>
            </div>
            <LoadingButton size={"lg"} className="w-full mt-3 " type="submit" isLoading={isLoading}>
              Login Now
            </LoadingButton>
          </form>
          <h1 className="mt-4 text-lg text-gray-800">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup">
              {" "}
              <span className="text-blue-800 font-semibold underline">Signup Here</span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
