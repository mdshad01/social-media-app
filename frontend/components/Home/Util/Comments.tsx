"use client";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import {
  addComment,
  addReply,
  deleteComment,
  likeComment,
} from "@/store/postSlice";
import { Post, User } from "@/type";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

type Props = {
  user: User | null;
  post: Post | null;
};

const Comments = ({ user, post }: Props) => {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleComment = async (id: string) => {
    if (!comment) return;
    const addCommentReq = async () =>
      await axios.post(
        `${BASE_API_URL}/posts/comment/${id}`,
        { text: comment },
        { withCredentials: true }
      );

    const result = await handleAuthRequest(addCommentReq);
    if (result?.data.status == "success") {
      dispatch(addComment({ postId: id, comment: result?.data.data.comment }));
      toast.success("Comment Posted.");
      setComment("");
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const likeCommentReq = async () =>
      await axios.post(
        `${BASE_API_URL}/posts/comment/like/${commentId}`,
        {},
        { withCredentials: true }
      );

    const result = await handleAuthRequest(likeCommentReq);
    if (result?.data.status == "success" && user) {
      dispatch(likeComment({ postId: post!._id, commentId, userId: user._id }));
    }
  };

  const handlePostReply = async (commentId: string) => {
    if (!replyText) return;

    const replyReq = async () =>
      await axios.post(
        `${BASE_API_URL}/posts/comment/reply/${commentId}`,
        { text: replyText },
        { withCredentials: true }
      );

    const result = await handleAuthRequest(replyReq);
    if (result?.data.status == "success") {
      dispatch(
        addReply({
          postId: post!._id,
          commentId,
          reply: result.data.data.reply,
        })
      );
      toast.success("Reply Posted.");
      setReplyText("");
      // Keep reply section open - don't set replyTo to null
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    // if (!confirm("Are you sure you want to delete this comment?")) return;

    const deleteCommentReq = async () =>
      await axios.delete(`${BASE_API_URL}/posts/comment/${commentId}`, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(deleteCommentReq);
    if (result?.data.status == "success") {
      dispatch(deleteComment({ postId: post!._id, commentId }));
      toast.success("Comment deleted.");
    }
  };

  const toggleReply = (commentId: string) => {
    if (replyTo === commentId) {
      setReplyTo(null); // Close if already open
      setReplyText(""); // Clear input
    } else {
      setReplyTo(commentId); // Open
    }
  };

  return (
    <div className="px-3">
      {/* WRITE */}
      <div className="flex items-center gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt=""
          width={32}
          height={32}
          className="rounded-full w-8 h-8 cursor-pointer "
        />
        <div className="flex items-center justify-between bg-accent rounded-xl text-sm px-4 py-2 w-[90%]">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="write a comment..."
            className="bg-transparent outline-none flex-1"
          />
          <button
            onClick={() => handleComment(post!._id)}
            className="cursor-pointer rounded-lg px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            post
          </button>
        </div>
      </div>
      {/* COMMENTS */}
      <div className="">
        {post?.comments?.map((item) => {
          const isLiked = user && item.likes?.includes(user._id);
          const replyCount = item.replies?.length || 0;

          return (
            <div key={item._id}>
              <div className="flex justify-between gap-4 mt-6 ">
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
                  <div className="flex items-center gap-8 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => handleLikeComment(item._id)}
                        className="cursor-pointer"
                      >
                        {isLiked ? (
                          <Image
                            src="/liked.png"
                            alt=""
                            width={12}
                            height={12}
                            className="w-3 h-3"
                          />
                        ) : (
                          <Image
                            src="/like.png"
                            alt=""
                            width={12}
                            height={12}
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                      <span className="text-border">|</span>
                      <span className="text-muted-foreground">
                        {item.likes?.length || 0} Likes
                      </span>
                    </div>
                    <div
                      onClick={() => toggleReply(item._id)}
                      className="cursor-pointer hover:text-primary transition-colors"
                    >
                      Reply {replyCount > 0 && `(${replyCount})`}
                    </div>
                  </div>

                  {/* REPLIES AND INPUT - Show when replyTo matches */}
                  {replyTo === item._id && (
                    <div className="mt-4">
                      {/* EXISTING REPLIES */}
                      {item.replies && item.replies.length > 0 && (
                        <div className="ml-6 mb-4 space-y-4">
                          {item.replies.map((reply) => (
                            <div key={reply._id} className="flex gap-3">
                              <Image
                                src={
                                  reply?.user?.profilePicture || "/noAvatar.png"
                                }
                                alt=""
                                width={32}
                                height={32}
                                className="rounded-full w-8 h-8 cursor-pointer"
                              />
                              <div className="flex flex-col gap-1 flex-1">
                                <span className="font-medium text-sm">
                                  {reply?.user?.username}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  {reply?.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* REPLY INPUT */}
                      <div className="flex items-center gap-2 ml-6">
                        <Image
                          src={user?.profilePicture || "/noAvatar.png"}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full w-6 h-6 cursor-pointer"
                        />
                        <div className="flex items-center justify-between bg-accent rounded-xl text-xs px-3 py-2 flex-1">
                          <input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            type="text"
                            placeholder={`Reply to ${item?.user?.username}...`}
                            className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                          />
                          <button
                            onClick={() => handlePostReply(item._id)}
                            className="cursor-pointer rounded-lg px-2 py-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* MORE - Only show for own comments */}
                {user?._id === item.user._id && (
                  <div
                    className="relative"
                    ref={openDropdown === item._id ? dropdownRef : null}
                  >
                    <Image
                      src="/more.png"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 cursor-pointer"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item._id ? null : item._id
                        )
                      }
                    />

                    {/* Dropdown Menu */}
                    {openDropdown === item._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
                        <button
                          onClick={() => handleDeleteComment(item._id)}
                          className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-destructive transition-colors"
                        >
                          <MdDeleteOutline className="text-lg" />
                          <span>Delete</span>
                        </button>
                        {/* Edit option - placeholder for future */}
                        {/* <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700">
          <MdEdit className="text-lg" />
          <span>Edit</span>
        </button> */}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {/* COMMENT */}
      </div>
    </div>
  );
};

export default Comments;
