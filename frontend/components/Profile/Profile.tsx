"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleAuthRequest } from "../util/apiRequest";
import { Loader} from "lucide-react";

import ProfileCard from "./util/ProfileCard";
import UserInfoCard from "./util/UserInfoCard";
import Feed from "./util/Feed";
import LeftMenu from "../Home/LeftMenu";
import UserMediaCart from "./util/UserMediaCart";
import Edit from "./util/Edit";
import PostOrSaveBtn from "./util/PostOrSaveBtn";
import SaveFeed from "./util/SaveFeed";
import MobileInfoCard from "./util/MobileInfoCard";

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
  const [savePost, setSavePost] = useState<boolean>(false);

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
      const getUserReq = async () =>
        await axios.get(`${BASE_API_URL}/users/profile/${id}`);
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) setUserProfile(result.data.data.user);
    };
    getUser();
  }, [router, id]);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex pt-6 bg-background">
      <div className="lg:w-[20%] xl:w-[18%] hidden md:block  h-full ">
        {/* <LeftSidebar /> */}
        <LeftMenu type="profile" />
      </div>
      <div className="  w-full lg:w-[70%] xl:w-[60%] bg-background">
        <div className=" px-0 md:px-5 flex flex-col  ">
          <ProfileCard userProfile={userProfile} />
          <div className="md:hidden w-full flex items-center justify-center mt-4 md:mt-12">
            <MobileInfoCard
              setIsEdit={setIsEdit}
              userProfile={userProfile}
              id={id}
              idFollowing={idFollowing}
              updateFollowerCount={updateFollowerCount}
            />
          </div>
          <div className="md:px-8 py-2">
            <PostOrSaveBtn
              postOrSave={postOrSave}
              isProfileOwn={isProfileOwn}
              setPostOrSave={setPostOrSave}
            />
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
