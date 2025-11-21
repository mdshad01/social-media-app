import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ActivityItem from "./ActivityItem";

const tabs = [
  { value: "all", label: "All" },
  { value: "post", label: "Posts" },
  { value: "comment", label: "Comments" },
  { value: "like", label: "Likes" },
  { value: "follow", label: "Follows" },
];

const ActivityType = ({ activityType, setType }) => {
  const { activities } = useSelector((state: RootState) => state.activity);
  const filterActivities =
    activityType === "all"
      ? activities
      : activities.filter((activity) => activity.type === activityType);

  return (
    <div className="pt-2">
      <h3 className="py-4 text-xl font-semibold text-gray-600 pl-2">All activity</h3>
      <div>
        <ul className="flex items-center justify-start gap-3  py-1">
          {tabs.map((item) => (
            <li
              onClick={() => setType(item.value)}
              key={item.value}
              className={`px-4 py-1 font-medium rounded-2xl cursor-pointer transition-all border-[2.2px] border-gray-300  ${
                activityType === item.value
                  ? "bg-black/90 text-white border-black shadow-none"
                  : "text-gray-800 bg-white hover:shadow hover:border-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      {filterActivities.map((activity, id) => (
        <ActivityItem activity={activity} key={id} />
      ))}
    </div>
  );
};

export default ActivityType;
