"use client";
import React, { useEffect, useState } from 'react'
import LeftMenu from '../Home/LeftMenu';
import SuggestedUser from '../Home/Util/SuggestedUser';
import Ad from '../Home/Util/Ad';
import ActivityStats from './ActivityStats';
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "../util/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setActivity, setActivityStats } from "@/store/activitySlice";
import ActivityType from './ActivityType';

const Activity = () => {
    const [type, setType] = useState<string>("all");

     const { activities, stats } = useSelector(
    (state: RootState) => state.activity
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(activities,stats);

  useEffect(() => {
    const getActivity = async () => {
      const getActivityReq = async () =>
        await axios.get(`${BASE_API_URL}/users/activity`, {
          withCredentials: true,
        });

      const result = await handleAuthRequest(getActivityReq, setIsLoading);

      if (result) {
        dispatch(setActivity(result.data.data.activities));
        dispatch(setActivityStats(result.data.data.stats));
      }
    };
    getActivity();
  }, [dispatch]);

  console.log(activities);
  return (
    <div className="flex flex-col">
    <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6 md:px-2 sm:px-0">
      {/* ✅ Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block md:w-[30%] lg:w-[20%]">
        <LeftMenu type="profile" />
      </div>

      {/* ✅ Feed - Full width on mobile */}
      <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%]  p-5 bg-white">
        <div className="flex flex-col gap-0 -mt-5">
          <ActivityType activityType={type} setType={setType}/>
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

export default Activity