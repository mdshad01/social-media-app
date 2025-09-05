"use client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // console.log("FORMDATA", formData);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // create our request
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
            Sign Up with <span className="text-blue-500">ShadSocial</span>
          </h1>
          <form onSubmit={handleSubmit} className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]">
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Username
              </label>
              <input
                name="username"
                type="text"
                id="username"
                placeholder="username"
                className="px-4 py-4 w-full rounded-lg bg-gray-200 block outline-none"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
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
            </div>
            <div className="mb-4">
              <PasswordInput
                label="Confirm Password"
                name="passwordConfirm"
                placeholder="Confirm password"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>
            <LoadingButton size={"lg"} className="w-full mt-3 " type="submit" isLoading={isLoading}>
              Sign Up
            </LoadingButton>
          </form>
          <h1 className="mt-4 text-lg text-gray-800">
            Already have account ?{" "}
            <Link href="/auth/login">
              {" "}
              <span className="text-blue-800 font-semibold underline">Login Here</span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
