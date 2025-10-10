import React from "react";
import Post from "./PostCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Feed = () => {
  const user = useSelector((state: RootState) => state?.auth.user);
  console.log(user);
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12  mt-6 scrollbar-hide">
      {user?.posts?.length ? (
        user.posts.map((post, index) => <Post key={post._id || index} post={post} user={user} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Feed;
