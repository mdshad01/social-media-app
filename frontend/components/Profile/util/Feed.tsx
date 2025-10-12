import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/type";
// import PostCard from "./PostCard";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { setPost } from "@/store/postSlice";
import { Loader } from "lucide-react";
import PostCard from "@/components/Home/Util/PostCard";

const Feed = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleGetUserPost = async (id: string) => {
      const getUserPostReq = async () =>
        await axios.get(`${BASE_API_URL}/posts/user-post/${id}`, { withCredentials: true });

      const result = await handleAuthRequest(getUserPostReq, setIsLoading);
      if (result) {
        dispatch(setPost(result.data.data.posts));
      }
    };
    if (user) handleGetUserPost(user._id);
  }, [dispatch]);

  console.log(user);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }
  if (posts.length < 1) {
    return <div className="text-3xl m-8 text-center capitalize font-black">No post avaliable</div>;
  }
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12  mt-6 scrollbar-hide">
      {user ? posts.map((post, index) => <PostCard key={index} post={post} user={user} />) : <p>No posts available</p>}
    </div>
  );
};

export default Feed;
