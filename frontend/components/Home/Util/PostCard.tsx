"use client";
import Image from "next/image";
import React, { useState } from "react";
import Comments from "@/components/Home/Util/Comments";
import { Post, User } from "@/type";
import DotButton from "./DotButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useDispatch } from "react-redux";
import { likeOrDislike } from "@/store/postSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  post: Post | null;
  index?: number;
  user: User | null;
};

const PostCard = ({ post, user }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [commButton, setCommButton] = useState(false);

  const handleLikeOrDislike = async (id: string) => {
    const result = await axios.post(
      `${BASE_API_URL}/posts/like-dislike/${id}`,
      {},
      { withCredentials: true }
    );
    if (result.data.status == "success") {
      if (user?._id) {
        dispatch(likeOrDislike({ postId: id, userId: user?._id }));
        toast.success(result.data.message);
      }
    }
  };

  const handleVoteOnPoll = async (postId: string, optionIndex: number) => {
    try {
      const result = await axios.post(
        `${BASE_API_URL}/posts/poll/vote`,
        { postId, optionIndex },
        { withCredentials: true }
      );
      if (result.data.status === "success") {
        toast.success(result.data.message);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const handleRSVP = async (postId: string) => {
    try {
      const result = await axios.post(
        `${BASE_API_URL}/posts/event/rsvp/${postId}`,
        {},
        { withCredentials: true }
      );
      if (result.data.status === "success") {
        toast.success(result.data.message);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to RSVP");
    }
  };

  if (!post) return null;

  return (
    <div className="flex flex-col gap-4 bg-card py-5 rounded-md">
      {/* USER */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Image
            onClick={() => router.push(`/profile/${post?.user?._id}`)}
            src={
              post?.user?.profilePicture ||
              "https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"
            }
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
          <span
            onClick={() => router.push(`/profile/${post?.user?._id}`)}
            className="font-medium cursor-pointer"
          >
            {post?.user?.username}
          </span>
        </div>
        <DotButton post={post} user={user} />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-4">
        {/* Caption */}
        {post?.caption && <p className="px-4">{post.caption}</p>}

        {/* IMAGE POST */}
        {post?.image?.url && !post?.video && (
          <div className="w-full relative overflow-hidden bg-black">
            <Image
              src={post.image.url}
              alt="Post image"
              width={600}
              height={800}
              className="w-full h-auto object-cover max-h-[700px]"
            />
          </div>
        )}

        {/* VIDEO POST */}
        {post?.video?.url && (
          <div className="w-full relative overflow-hidden bg-black">
            <video
              src={post.video.url}
              controls
              className="w-full h-auto max-h-[700px]"
            />
          </div>
        )}

          {/* POLL POST */}
        {post?.postType === "poll" && post?.poll && (
          <div className="px-4 space-y-2">
            <p className="font-semibold mb-3">{post.poll.question}</p>
            {(() => {
              // ✅ Calculate totalVotes once, outside the map
              const totalVotes = post.poll!.options.reduce(
                (sum, opt) => sum + opt.votes.length,
                0
              );

              return (
                <>
                  {post.poll!.options.map((option, index) => {
                    const percentage =
                      totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    const hasVoted = user?._id && option.votes.includes(user._id);

                    return (
                      <button
                        key={index}
                        onClick={() => handleVoteOnPoll(post._id, index)}
                        className={`w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                          hasVoted ? "bg-blue-50 border-blue-500" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-left">{option.text}</span>
                          <span className="text-sm text-gray-500">
                            {percentage.toFixed(0)}% ({option.votes.length})
                          </span>
                        </div>
                        {totalVotes > 0 && (
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                hasVoted ? "bg-blue-500" : "bg-gray-400"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  <p className="text-sm text-gray-500 mt-2">
                    Total votes: {totalVotes}
                  </p>
                </>
              );
            })()}
          </div>
        )}

        {/* EVENT POST */}
        {post?.postType === "event" && post?.event && (
          <div className="px-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{post.event.title}</h3>
              <div className="space-y-1 text-gray-700 mb-3">
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  {new Date(post.event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {post.event.time && (
                  <p className="flex items-center gap-2">
                    <span>🕐</span>
                    {post.event.time}
                  </p>
                )}
                {post.event.location && (
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    {post.event.location}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRSVP(post._id)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  user?._id && post.event.attendees.includes(user._id)
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {user?._id && post.event.attendees.includes(user._id)
                  ? "✓ Going"
                  : "RSVP"}{" "}
                ({post.event.attendees.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIONS */}
      <div className="flex items-center justify-between text-sm mb-2 px-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-3 bg-background p-2 rounded-xl">
            <div
              onClick={() => handleLikeOrDislike(post._id)}
              className="cursor-pointer"
            >
              {user?._id && post?.likes && post?.likes.includes(user._id) ? (
                <Image src="/liked.png" alt="" width={20} height={20} />
              ) : (
                <Image src="/like.png" alt="" width={20} height={20} />
              )}
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post?.likes?.length}{" "}
              <span className="hidden md:inline">Likes</span>
            </span>
          </div>

          <div
            onClick={() => setCommButton((prev) => !prev)}
            className="flex items-center gap-3 bg-background p-2 rounded-xl transition-all cursor-pointer"
          >
            <Image src="/comment.png" alt="" width={20} height={20} />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {post?.comments?.length}{" "}
              <span className="hidden md:inline">Comments</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-background p-2 rounded-xl">
          <Image
            src="/share.png"
            alt=""
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {post?.share?.length}{" "}
            <span className="hidden md:inline">Shares</span>
          </span>
        </div>
      </div>

      {/* COMMENTS */}
      {commButton && <Comments post={post} user={user} />}
    </div>
  );
};

export default PostCard;
