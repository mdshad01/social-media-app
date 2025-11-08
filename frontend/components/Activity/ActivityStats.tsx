import React from "react";
import { Heart, MessageCircle, Users } from "lucide-react";

interface Stats {
  totalLikes: number;
  totalComments: number;
  totalFollowers: number;
}

interface Props {
  stats: Stats;
}

const ActivityStats = ({ stats }: Props) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Activity Summary</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Likes */}
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
          <Heart className="w-6 h-6 text-red-500 mb-2" />
          <span className="text-2xl font-bold text-gray-800">{stats.totalLikes}</span>
          <span className="text-xs text-gray-600">Likes</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <MessageCircle className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-gray-800">{stats.totalComments}</span>
          <span className="text-xs text-gray-600">Comments</span>
        </div>

        {/* Followers */}
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
          <Users className="w-6 h-6 text-green-500 mb-2" />
          <span className="text-2xl font-bold text-gray-800">{stats.totalFollowers}</span>
          <span className="text-xs text-gray-600">Followers</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;
