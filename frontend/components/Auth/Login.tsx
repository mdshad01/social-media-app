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
import {
  Share2,
  Users,
  LayoutList,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [deactivatedUserData, setDeactivatedUserData] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReactivateAccount = async () => {
    const reactiveRequest = async () =>
      await axios.post(
        `${BASE_API_URL}/users/reactivate-account`,
        {},
        {
          withCredentials: true,
        }
      );

    const result = await handleAuthRequest(reactiveRequest, setIsLoading);

    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success("Account reactivated successfully!");
      setShowReactivateModal(false);
      router.push("/");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const loginReq = async () =>
      axios.post(`${BASE_API_URL}/users/login`, formData, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(loginReq, setIsLoading);

    if (result) {
      const user = result.data.data.user;

      // Check if account is deactivated
      if (user.isDeleted) {
        setDeactivatedUserData(user);
        setShowReactivateModal(true);
      } else {
        // Normal login flow
        dispatch(setAuthUser(user));
        toast.success(result.data.message);
        router.push("/");
      }
    }
  };

  const features = [
    {
      icon: <Share2 className="w-10 h-10 text-black bg-white rounded-lg p-2" />,
      title: "Seamless Sharing",
      desc: "Post updates, photos, and videos instantly.",
    },
    {
      icon: <Users className="w-10 h-10 text-black bg-white rounded-lg p-2" />,
      title: "Engage with Friends",
      desc: "Like, comment, and connect in real-time.",
    },
    {
      icon: (
        <LayoutList className="w-10 h-10 text-black bg-white rounded-lg p-2" />
      ),
      title: "Smart Feed",
      desc: "Stay updated with content you love.",
    },
    {
      icon: (
        <ShieldCheck className="w-10 h-10 text-black bg-white rounded-lg p-2" />
      ),
      title: "Private & Secure",
      desc: "Your data, your privacy — always protected.",
    },
  ];

  // Calculate days remaining for reactivation
  const daysRemaining = deactivatedUserData
    ? Math.ceil(
        (new Date(deactivatedUserData.deletionExecuteAt).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="w-full h-[100vh] overflow-hidden bg-white">
      <div className="flex flex-col lg:flex-row ">
        {/* Banner */}
        <div className="lg:w-[55%] h-screen hidden lg:block relative">
          <Image
            src="/Banner8.jpg"
            alt="signup"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
          <div className="lg:w-160 lg:h-140 bg-transparent backdrop-blur-2xl border-2 rounded-3xl flex flex-col py-6 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-transparent">
            <div className="flex flex-col items-center mb-5">
              <h1 className="font-bold lg:text-3xl uppercase mb-8 text-blue-500 bg-white/85 hover:bg-white/90 backdrop-blur-2xl px-4 py-2 rounded-lg">
                SHADSOCIAL
              </h1>
              <h3 className="font-bold leading-tight text-3xl text-white mb-2">
                Where Connections Turn Into Communities
              </h3>
              <p className="text-base text-white/90">
                Create, connect, and discover with people who matter to you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-4 mb-4 mt-5">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 flex flex-col backdrop-blur-3xl mb-3 p-3 rounded-lg hover:scale-105 transition-all duration-300 hover:bg-white/15"
                >
                  <div className="flex gap-4 mb-3 items-center">
                    {item.icon}
                    <h3 className="text-gray-100  font-medium text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-200">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:w-[45%]  h-screen p-8 ">
          <div className=" h-full w-full flex flex-col items-center justify-center bg-blue-100 rounded-lg relative overflow-hidden z-10 ">
            <div className="bg-blue-200 rounded-full absolute h-70 w-70 top-10 left-15 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
            <div className="bg-[#b8d4ff] rounded-full absolute h-84 w-84 -bottom-30 -right-35 -translate-x-1/5 -translate-y-1/5 -z-10"></div>
            <h1 className="font-bold text-xl sm:text-2xl uppercase mb-8">
              Login with <span className="text-blue-500">ShadSocial</span>
            </h1>
            <form
              onSubmit={handleSubmit}
              className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]"
            >
              <div className="mb-4">
                <label htmlFor="name" className="font-semibold mb-2 block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="email address"
                  className="px-4 py-4 w-full rounded-lg bg-gray-100 block outline-none"
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
                  className="text-blue-500 mt-2 font-semibold text-base cursor-pointer text-right block"
                >
                  Forget Password?
                </Link>
              </div>
              <LoadingButton
                size={"lg"}
                className="w-full mt-3 gradient-btn"
                type="submit"
                isLoading={isLoading}
              >
                Login Now
              </LoadingButton>
            </form>
            <h1 className="mt-4 text-lg text-gray-800">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup">
                {" "}
                <span className="text-blue-800 font-semibold underline">
                  Signup Here
                </span>
              </Link>
            </h1>
          </div>
        </div>
      </div>

      {/* Reactivate Account Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Account Deactivated</h2>
              <button onClick={() => setShowReactivateModal(false)}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle
                  className="text-blue-600 flex-shrink-0"
                  size={24}
                />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    Your account is deactivated
                  </p>
                  <p className="text-sm text-blue-700">
                    You have{" "}
                    <span className="font-semibold">{daysRemaining} days</span>{" "}
                    remaining to reactivate your account. After that, your
                    account and all data will be permanently deleted.
                  </p>
                </div>
              </div>

              <p className="text-gray-700">
                Would you like to reactivate your account now? All your posts,
                followers, and data will be restored.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReactivateModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReactivateAccount}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Reactivating..." : "Reactivate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
