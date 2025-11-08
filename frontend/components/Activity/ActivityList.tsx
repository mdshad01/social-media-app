import React from "react";
import ActivityItem from "./ActivityItem";

type ActivityType = "like" | "comment" | "follow";

interface Activity {
  type: ActivityType;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  post?: {
    _id: string;
    caption?: string;
    image?: {
      url: string;
    };
  };
  comment?: string;
  createdAt: string;
}

interface Props {
  activities: Activity[];
}

const ActivityList = ({ activities }: Props) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500 text-lg">No activity yet</p>
        <p className="text-gray-400 text-sm mt-2">When people interact with your posts, you'll see it here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityList;
