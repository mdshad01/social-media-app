"use client";
import React, { useState } from 'react'
import LeftMenu from '../Home/LeftMenu';
import Addpost2 from '../Home/Util/Addpost2';
import Feed from '../Home/Feed';
import RightSidebar from '../Home/RightSidebar';
import SuggestedUser from '../Home/Util/SuggestedUser';
import Ad from '../Home/Util/Ad';
import ActivityStats from './ActivityStats';

const Activity = () => {
    const [first, setfirst] = useState();
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
          <ActivityStats/>
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