"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleAuthRequest } from "../util/apiRequest";
import { Loader } from "lucide-react";
import LeftSidebar from "../Home/LeftSidebar";

type Props = {
  id: string;
};

const Profile = ({ id }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setuserProfile] = useState<User>();

  const isProfileOwn = user?._id === id;
  const idFollowing = user?.following.includes(id);

  console.log("User", userProfile);
  console.log(isProfileOwn);

  useEffect(() => {
    if (!user) router.push("/auth/login");
    const getUser = async () => {
      const getUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${id}`);
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) setuserProfile(result.data.data.user);
    };
    getUser();
  }, [user, router, id]);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return <div className="bg-gray-700 h-screen w-full">
    <div className="">
        <LeftSidebar
    </div>
  </div>;
};

export default Profile;
