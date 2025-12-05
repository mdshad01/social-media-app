"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import LeftMenu from "../Home/LeftMenu";
import SettingContext from "./SettingContext";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("account");
  return (
    <div className="flex flex-col ">
      <div className="flex">
        <div className="hidden md:block md:w-[30%] lg:w-[25%]">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-full">
          <SettingContext activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
