"use client";
import React, { useState } from "react";
import Sidebar from "../../Sidebar";

const Display = () => {
  const [activeTab, setActiveTab] = useState<string>("account");
  return (
    <div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Display;
