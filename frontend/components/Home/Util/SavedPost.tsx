"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import LeftMenu from "../LeftMenu";
import Feed from "../Feed";
import RightSidebar from "../RightSidebar";
import SaveFeed from "@/components/Profile/util/SaveFeed";
import { User } from "@/type";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import SuggestedUser from "./SuggestedUser";

type props = {
  setSavePost?: void;
};
const SavedPost = ({ setSavePost }: props) => {
  const user = useSelector((state:RootState) => state.auth.user);
  const [userProfile, setUserProfile] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const getUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${user?._id}`,{ withCredentials: true });
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) setUserProfile(result.data.data.user);
    };
    getUser();
  }, [user?._id]);
  return (
  <div className="flex flex-col">
    <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6 md:px-2 sm:px-4">
      {/* ✅ Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block md:w-[30%] lg:w-[20%]">
        <LeftMenu type="profile" />
      </div>

      {/* ✅ Feed - Full width on mobile */}
      <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%]">
        <div className="flex flex-col gap-0 -mt-5">
          <SaveFeed userProfile={userProfile}/>
        </div>
      </div>

      {/* ✅ Right Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:block lg:w-[28%] mt-1">
        {/* <RightSidebar /> */}
        <SuggestedUser />
        
      </div>
    </div>
  </div>
  )
};

export default SavedPost;
