import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

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
  activity: Activity;
}

const ActivityItem = ({ activity }: Props) => {
  const router = useRouter();

  const getActivityIcon = () => {
    switch (activity.type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" fill="currentColor" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
    }
  };

  const getTimeAgo = () => {
    try {
    //   return formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const handleUserClick = () => {
    router.push(`/profile/${activity.user._id}`);
  };

  const handlePostClick = () => {
    if (activity.post) {
      router.push(`/`);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="relative">
          <Image
            src={activity.user.profilePicture || "/default-avatar.png"}
            alt={activity.user.username}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
            onClick={handleUserClick}
          />
          {/* Activity Icon Badge */}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
            {getActivityIcon()}
          </div>
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm">
                <span
                  className="font-semibold text-gray-800 hover:underline cursor-pointer"
                  onClick={handleUserClick}>
                  {activity.user.username}
                </span>
                <span className="text-gray-600 ml-1">{getActivityText()}</span>
              </p>

              {/* Comment Text */}
              {activity.type === "comment" && activity.comment && (
                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">"{activity.comment}"</p>
              )}

              {/* Time */}
              <p className="text-xs text-gray-500 mt-1">{getTimeAgo()}</p>
            </div>

            {/* Post Thumbnail */}
            {activity.post && activity.post.image && (
              <Image
                src={activity.post.image.url}
                alt="Post"
                width={60}
                height={60}
                className="w-15 h-15 rounded object-cover cursor-pointer"
                onClick={handlePostClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
