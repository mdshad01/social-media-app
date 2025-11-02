import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Post, User } from "@/type";
import PostCard from "@/components/Home/Util/PostCard";

type Props = {
  userProfile: User | undefined;
};

const SaveFeed = ({ userProfile }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Get saved posts from userProfile (already populated from backend)
  const savedPosts = userProfile?.savedPosts as Post[] | undefined;

  // No saved posts
  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg mt-6">
        <p className="text-center text-gray-500 py-8">No saved posts yet</p>
      </div>
    );
  }

  return (
    <div className="py-4 bg-white shadow-md rounded-lg flex flex-col gap-12 mt-6 scrollbar-hide">
      {savedPosts.map((post, index) => (
        <PostCard key={post._id || index} post={post} user={user} />
      ))}
    </div>
  );
};

export default SaveFeed;
