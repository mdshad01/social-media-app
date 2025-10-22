"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
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
import UserMediaCart from "./util/UserMediaCart";
import Edit from "./util/Edit";
import PostOrSaveBtn from "./util/PostOrSaveBtn";
import SaveFeed from "./util/SaveFeed";

type Props = {
  id: string;
};

const Profile = ({ id }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User>();
  const [isEdit, setIsEdit] = useState(false);

  const isProfileOwn = user?._id === id;
  const idFollowing = id ? user?.following.includes(id) : false;
  // const idFollowing = true;

  // console.log("User", userProfile);
  // console.log(isProfileOwn);

  // ✅ Add this function to update userProfile locally
  const updateFollowerCount = (isFollowing: boolean) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        followers: isFollowing
          ? [...userProfile.followers, user!._id] // Add follower
          : userProfile.followers.filter((f) => f !== user!._id), // Remove follower
      });
    }
  };

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  useEffect(() => {
    const getUser = async () => {
      const getUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${id}`);
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) setUserProfile(result.data.data.user);
    };
    getUser();
  }, [router, id]);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-100">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex pt-6 bg-slate-100">
      <div className="lg:w-[20%] xl:w-[18%] hidden md:block  h-full ">
        {/* <LeftSidebar /> */}
        <LeftMenu type="profile" />
      </div>

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
      <div className="  w-full lg:w-[70%] xl:w-[60%] ">
        <div className=" px-5 flex flex-col ">
          <ProfileCard userProfile={userProfile} />
          <div className="px-8 py-2">
            <PostOrSaveBtn postOrSave={postOrSave} isProfileOwn={isProfileOwn} setPostOrSave={setPostOrSave} />
            {postOrSave === "POST" && <Feed userProfile={userProfile} />}
            {postOrSave === "SAVE" && <SaveFeed userProfile={userProfile} />}
          </div>
        </div>
      </div>

      <div className="hidden xl:flex xl:flex-col gap-6 w-[22%] ">
        <UserInfoCard
          setIsEdit={setIsEdit}
          userProfile={userProfile}
          id={id}
          idFollowing={idFollowing}
          updateFollowerCount={updateFollowerCount}
        />

        <UserMediaCart userProfile={userProfile} />
      </div>
      {isEdit && <Edit setIsEdit={setIsEdit} />}
    </div>
  );
};

export default Profile;
