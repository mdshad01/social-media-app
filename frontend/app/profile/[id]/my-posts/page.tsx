"use client";
import LeftMenu from '@/components/Home/LeftMenu'
import Ad from '@/components/Home/Util/Ad';
import SuggestedUser from '@/components/Home/Util/SuggestedUser';
import Feed from '@/components/Profile/util/Feed'
import { handleAuthRequest } from '@/components/util/apiRequest';
import { BASE_API_URL } from '@/server';
import { User } from '@/type';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const MyPostPage = () => {
    const user = useSelector((state:RootState) => state.auth.user);
  const [userProfile, setUserProfile] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const getUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${user?._id}`);
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
          <Feed userProfile={userProfile}  />
        </div>
      </div>

       <div className="hidden lg:block lg:w-[28%] mt-1 space-y-6">
        {/* <RightSidebar /> */}
        <SuggestedUser />
        <Ad size='md'/>
      </div>

    </div>
  </div>
  )
}

export default MyPostPage