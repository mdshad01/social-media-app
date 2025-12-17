import React from "react";
import PostActivity from "./util/PostActivity";
import CommentActivity from "./util/CommentActivity";
import LikeActivity from "./util/LikeActivity";
import FollowActivity from "./util/FollowActivity";
import { Activity } from "@/type";

type Props = {
  activity: Activity;
}

const ActivityItem = ({ activity }:Props) => {
  if (activity.type === "post") {
    return <PostActivity activity={activity} />;
  }

  if (activity.type === "comment") {
    return <CommentActivity activity={activity} />;
  }

  if (activity.type === "like") {
    return <LikeActivity activity={activity} />;
  }

  if (activity.type === "follow") {
    return <FollowActivity activity={activity} />;
  }
  return null;
};

export default ActivityItem;
