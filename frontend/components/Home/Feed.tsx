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

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dotButton, setDotButton] = useState(false);

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
  const handleLikeOrDislike = async (id: string) => {};

  const handleSaveUnsave = async (id: string) => {};
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
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12 scrollbar-hide">
      {user && posts.map((post, index) => <PostCard post={post} user={user} key={index} setDotButton={setDotButton} />)}
      {/* <PostCard /> */}
    </div>
  );
};

export default Feed;
