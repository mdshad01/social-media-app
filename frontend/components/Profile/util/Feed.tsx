import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { setPost } from "@/store/postSlice";
import { ProfileFeedSkeleton } from "@/components/Skeleton";
import PostCard from "@/components/Home/Util/PostCard";

type Props = {
  userProfile: User | undefined;
};

const Feed = ({ userProfile }: Props) => {
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
    if (userProfile?._id) handleGetUserPost(userProfile._id);
  }, [userProfile]);

  if (isLoading) {
    return <ProfileFeedSkeleton />;
  }
  if (posts.length < 1) {
    return <div className="text-3xl m-8 text-center capitalize font-black">No post avaliable</div>;
  }
  return (
    <div className="py-4 bg-background shadow-md rounded-lg flex flex-col gap-12  mt-2 scrollbar-hide">
      {user ? posts.map((post, index) => <PostCard key={index} post={post} user={user} />) : <p>No posts available</p>}
    </div>
  );
};

export default Feed;
