"use client";
import { Button } from "@/components/ui/button";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { addComment } from "@/store/postSlice";
import { Post, User } from "@/type";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

type Props = {
  user: User | null;
  post: Post | null;
};

const Comments = ({ user, post }: Props) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const handleComment = async (id: string) => {
    if (!comment) return;
    const addCommentReq = async () =>
      await axios.post(`${BASE_API_URL}/posts/comment/${id}`, { text: comment }, { withCredentials: true });

    const result = await handleAuthRequest(addCommentReq);
    if (result?.data.status == "success") {
      dispatch(addComment({ postId: id, comment: result?.data.data.comment }));
      toast.success("Comment Posted.");
      setComment("");
    }
  };

  console.log(user);

  return (
    <div>
      {/* WRITE */}
      <div className="flex items-center gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt=""
          width={32}
          height={32}
          className="rounded-full w-8 h-8 cursor-pointer "
        />
        <div className="flex items-center justify-between bg-slate-100 rounded-xl text-sm px-4 py-2 w-[90%]">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="write a comment..."
            className="bg-transparent outline-none flex-1"
          />
          <button
            onClick={() => handleComment(post!._id)}
            className="cursor-pointer rounded-lg px-3 py-1 bg-blue-500 text-gray-50">
            post
          </button>
        </div>
      </div>
      {/* COMMENTS */}
      <div className="">
        {post?.comments?.map((item) => {
          return (
            <div key={item._id} className="flex justify-between gap-4 mt-6 ">
              {/* AVATAR */}
              <Image
                src={item?.user?.profilePicture || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="rounded-full w-10 h-10 cursor-pointer"
              />
              {/* DESC */}
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-medium">{item?.user?.username}</span>
                <p>{item?.text}</p>
                <div className="flex items-center gap-8 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-4">
                    <Image src="/like.png" alt="" width={12} height={12} className="w-3 h-3 cursor-pointer" />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">256 Likes</span>
                  </div>
                  <div className="">Replay</div>
                </div>
              </div>
              {/* MORE */}
              <Image src="/more.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
            </div>
          );
        })}
        {/* COMMENT */}
      </div>
    </div>
  );
};

export default Comments;
