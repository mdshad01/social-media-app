"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaCommentDots, FaHeart, FaRegHeart } from "react-icons/fa";
import Comments from "@/components/Home/Util/Comments";
import { Post, User } from "@/type";
import DotButton from "./DotButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useDispatch } from "react-redux";
import { likeOrDislike } from "@/store/postSlice";
import { toast } from "sonner";

type Props = {
  post: Post | null;
  index?: number;
  // setDotButton: Dispatch<SetStateAction<boolean>>;
  user: User | null;
};

const PostCard = ({ post, user }: Props) => {
  const dispatch = useDispatch();
  const [commButton, setCommButton] = useState(false);

  const handleLikeOrDislike = async (id: string) => {
    const result = await axios.post(`${BASE_API_URL}/posts/like-dislike/${id}`, {}, { withCredentials: true });
    if (result.data.status == "success") {
      if (user?._id) {
        dispatch(likeOrDislike({ postId: id, userId: user?._id }));
        toast.success(result.data.message);
      }
    }
  };
  console.log(post);
  return (
    <div className="flex flex-col gap-4">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post?.user?.profilePicture || "https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{post?.user?.username}</span>
        </div>
        {/* <Image
          onClick={() => setDotButton((prev) => !prev)}
          src="/more.png"
          alt=""
          width={16}
          height={16}
          className="cursor-pointer"
        /> */}
        {/* <span>
          <PiDotsThreeOutlineFill onClick={() => setDotButton((prev) => !prev)} />
        </span> */}
        <DotButton post={post} user={user} />
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4">
        {/* Image Container - LinkedIn Style (No side gaps) */}
        {post?.image?.url && (
          <div className="w-full relative rounded-md overflow-hidden bg-black">
            <Image
              src={post.image.url}
              alt="Post image"
              width={600}
              height={800}
              className="w-full h-auto object-cover max-h-[700px] rounded-md"
            />
          </div>
        )}
        <p>{post?.caption}</p>
      </div>
      {/* INTERFACE */}
      <div className="flex items-center justify-between text-sm mb-4 px-2 ">
        <div className="flex gap-8">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
            <div onClick={() => handleLikeOrDislike(post!._id)} className="">
              {user?._id && post?.likes && post?.likes.includes(user?._id) ? (
                <Image src="/liked.png" alt="" width={20} height={20} className="cursor-pointer" />
              ) : (
                // <FaHeart className="text-red-500 h-5 w-5" />
                <Image src="/like.png" alt="" width={20} height={20} className="cursor-pointer" />

                // <FaRegHeart className=" h-5 w-5" />
              )}
            </div>

            {/* <FaRegHeart className="text-red-500 h-5 w-5" /> */}

            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post?.likes?.length} <span className="hidden md:inline">Likes</span>{" "}
            </span>
          </div>
          <div
            onClick={() => setCommButton((prev) => !prev)}
            className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl transition-all">
            <Image src="/comment.png" alt="" width={20} height={20} className="cursor-pointer" />
            {/* <FaCommentDots className="h-5 w-5" /> */}
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post?.comments?.length} <span className="hidden md:inline">Comments</span>{" "}
            </span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
            <Image src="/share.png" alt="" width={20} height={20} className="cursor-pointer" />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post?.share?.length} <span className="hidden md:inline">Shares</span>{" "}
            </span>
          </div>
        </div>
      </div>
      {commButton && <Comments post={post} user={user} />}
    </div>
  );
};

export default PostCard;
