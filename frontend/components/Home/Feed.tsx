"use client";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { setPost } from "@/store/postSlice";
import { FeedSkeleton } from "@/components/Skeleton";
import PostCard from "./Util/PostCard";

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Don't fetch if user is not loaded yet
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Don't fetch again if already fetched
    if (hasFetched) return;

    const getPosts = async () => {
      setIsLoading(true);
      const getAllPostReq = async () => 
        await axios.get(`${BASE_API_URL}/posts/all`, { withCredentials: true });

      const result = await handleAuthRequest(getAllPostReq, undefined, false);

      if (result) {
        dispatch(setPost(result.data.data.posts));
      }
      setIsLoading(false);
      setHasFetched(true);
    };
    
    getPosts();
  }, [dispatch, user, hasFetched]);

  if (isLoading) {
    return <FeedSkeleton count={3} />;
  }
  
  if (!user) {
    return <FeedSkeleton count={3} />;
  }
  
  if (posts.length < 1) {
    return <div className="text-3xl m-8 text-center capitalize font-black">No post available</div>;
  }
  
  return (
    <div className="py-4 bg-transparent flex flex-col gap-4 scrollbar-hide">
      {posts.map((post, index) => <PostCard post={post} user={user} key={post._id || index} />)}
    </div>
  );
};

export default Feed;
