"use client";
import Post from "./Util/PostCard";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { setPost } from "@/store/postSlice";
import { Loader } from "lucide-react";
import PostCard from "./Util/PostCard";
import DotButton from "./Util/DotButton";

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("POSTS", posts);

  useEffect(() => {
    const getPosts = async () => {
      const getAllPostReq = async () => await axios.get(`${BASE_API_URL}/posts/all`);

      const result = await handleAuthRequest(getAllPostReq, setIsLoading);

      if (result) {
        dispatch(setPost(result.data.data.posts));
      }
    };
    getPosts();
  }, [dispatch]);
  const handleComment = async (id: string) => {};
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
    <div className="py-4 bg-transparent flex flex-col gap-4 scrollbar-hide">
      {user && posts.map((post, index) => <PostCard post={post} user={user} key={index} />)}
    </div>
  );
};

export default Feed;
