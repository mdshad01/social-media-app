import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaCommentDots, FaRegHeart } from "react-icons/fa";
import Comments from "@/components/Profile/util/Comments";
import { Post, User } from "@/type";

type Props = {
  post: Post;
  index?: number;
  setDotButton: Dispatch<SetStateAction<boolean>>;
  user: User;
};

const PostCard = ({ post, setDotButton, user }: Props) => {
  const [commButton, setCommButton] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user?.profilePicture || "https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Jhon Carter</span>
        </div>
        <Image
          onClick={() => setDotButton((prev) => !prev)}
          src="/more.png"
          alt=""
          width={16}
          height={16}
          className="cursor-pointer"
        />
        {/* <span>
          <PiDotsThreeOutlineFill onClick={() => setDotButton((prev) => !prev)} />
        </span> */}
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-120 relative">
          {post.image?.url && <Image src={post.image?.url} alt="Image" fill className="object-cover rounded-md" />}
        </div>
        <p>{post.caption}</p>
      </div>
      <span></span>
      {/* INTERFACE */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
            <Image src="/like.png" alt="" width={20} height={20} className="cursor-pointer" />

            {/* <FaRegHeart className="hover:text-red-500 h-5 w-5" /> */}
            {/* <FaHeart /> */}
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post.likes.length} <span className="hidden md:inline">Likes</span>{" "}
            </span>
          </div>
          <div
            onClick={() => setCommButton((prev) => !prev)}
            className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl transition-all">
            <Image src="/comment.png" alt="" width={20} height={20} className="cursor-pointer" />
            {/* <FaCommentDots className="h-5 w-5" /> */}
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post.comments.length} <span className="hidden md:inline">Comments</span>{" "}
            </span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
            <Image src="/share.png" alt="" width={20} height={20} className="cursor-pointer" />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post.share.length} <span className="hidden md:inline">Shares</span>{" "}
            </span>
          </div>
        </div>
      </div>
      {commButton && <Comments post={post} user={user} />}
    </div>
  );
};

export default PostCard;
