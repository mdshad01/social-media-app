"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleAuthRequest } from "../util/apiRequest";
import { Loader, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
import LeftSidebar from "../Home/LeftSidebar";
import { BiAperture } from "react-icons/bi";
import Navbar from "../Home/Navbar";
import ProfileCard from "./util/ProfileCard";
import UserInfoCard from "./util/UserInfoCard";
import Feed from "./util/Feed";
import LeftMenu from "../Home/LeftMenu";

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
  const idFollowing = id ? user?.following.includes(id) : false;
  // const idFollowing = true;

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

  return (
    // <div className="flex flex-col">
    //   {/* Navbar (optional) */}
    //   {/* <div className="w-full h-[12vh]">
    //     <Navbar />
    //   </div> */}

    //   {/* Main layout */}
    <div className="flex  bg-slate-100 pt-6">
      {/* Left Sidebar */}
      <div className="w-[20%] hidden md:block  h-full ">
        {/* <LeftSidebar /> */}
        <LeftMenu type="profile" />
      </div>

      {/* Feed Section */}
      <div className="  w-full lg:w-[70%] xl:w-[55%] bg-slate-100">
        {/* Mobile Sidebar (Sheet) */}
        <div className="md:hidden p-2">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[320px] pl-4">
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>

              <div className="text-[#1b2356] flex items-center gap-2 justify-start">
                <BiAperture className="w-10 h-10" />
                <span className="text-2xl sm:text-3xl font-bold" onClick={() => router.push("/")}>
                  Shadsocial.
                </span>
              </div>

              <LeftSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className=" h-[45vh] px-5 bg-slate-100">
          <ProfileCard userProfile={userProfile} />
          <Feed />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block w-[25%]">
        <UserInfoCard userProfile={userProfile} id={id} idFollowing={idFollowing} />
      </div>
    </div>
    // </div>
  );
};

export default Profile;
