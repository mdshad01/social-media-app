"use client";
import Image from "next/image";
import { useState } from "react";
import { Post, User } from "@/type";
import DotButton from "./DotButton";
import PostDetailModal from "./PostDetailModal";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useDispatch } from "react-redux";
import { likeOrDislike, sharePost } from "@/store/postSlice";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleShare = async () => {
    if (!post) return;

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.user?.username}'s post`,
          text: post.caption || "Check out this post!",
          url: `${window.location.origin}/post/${post._id}`,
        });
        
        // Track share in backend only after successful share
        try {
          const result = await axios.post(
            `${BASE_API_URL}/posts/share/${post._id}`,
            {},
            { withCredentials: true }
          );
          if (result.data.status === "success" && user?._id) {
            dispatch(sharePost({ postId: post._id, userId: user._id }));
          }
        } catch (error) {
          console.error("Failed to track share:", error);
        }
        
        toast.success("Shared successfully!");
      } catch (err) {
        // User cancelled the share or error occurred
        const error = err as { name?: string };
        if (error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      const postUrl = `${window.location.origin}/post/${post._id}`;
      navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
      
      // Track share in backend
      try {
        const result = await axios.post(
          `${BASE_API_URL}/posts/share/${post._id}`,
          {},
          { withCredentials: true }
        );
        if (result.data.status === "success" && user?._id) {
          dispatch(sharePost({ postId: post._id, userId: user._id }));
        }
      } catch (error) {
        console.error("Failed to track share:", error);
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
    <>
      <PostDetailModal
        post={post}
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex flex-col gap-4 bg-card py-5 rounded-xl shadow-lg border border-border/50">
      {/* USER */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Image
            onClick={() => router.push(`/profile/${post?.user?._id}`)}
            src={
              post?.user?.profilePicture ||
              "/noAvatar3.svg"
            }
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
          <div className="flex flex-col">

          <span
            onClick={() => router.push(`/profile/${post?.user?._id}`)}
            className="font-medium cursor-pointer"
            >
            {post?.user?.username}
          </span>
          {post?.user?.bio &&
          <span className="text-sm text-muted-foreground">
            {post?.user?.bio.slice(0,55) + "..."}
          </span>
          }
            </div>
        </div>
        <DotButton post={post} user={user} />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-4">
        {/* Caption */}
        {post?.caption && (
          <p 
            className="px-4 text-sm cursor-pointer text-foreground/90 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            {post.caption}
          </p>
        )}

        {/* IMAGE POST */}
        {post?.image?.url && !post?.video && (
          <div 
            className="w-full relative overflow-hidden bg-muted/30 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={post.image.url}
              alt="Post image"
              width={800}
              height={900}
              className="w-full h-auto object-cover max-h-[80vh]"
            />
          </div>
        )}

        {/* VIDEO POST */}
        {post?.video?.url && (
          <div 
            className="w-full relative overflow-hidden bg-black cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
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
                        className={`w-full p-3 border border-border rounded-lg hover:bg-accent transition-colors ${
                          hasVoted ? "bg-primary/10 border-primary" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-left text-foreground">{option.text}</span>
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(0)}% ({option.votes.length})
                          </span>
                        </div>
                        {totalVotes > 0 && (
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                hasVoted ? "bg-primary" : "bg-muted-foreground/50"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  <p className="text-sm text-muted-foreground mt-2">
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
            <div className="border-l-4 border-primary bg-primary/10 dark:bg-primary/5 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-foreground">{post.event.title}</h3>
              <div className="space-y-1 text-muted-foreground mb-3">
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
                    ? "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
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
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              {post?.likes?.length}{" "}
              <span className="hidden md:inline">Likes</span>
            </span>
          </div>

          <div
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-background p-2 rounded-xl transition-all cursor-pointer"
          >
            <Image src="/comment.png" alt="" width={20} height={20} />
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              {post?.comments?.length}{" "}
              <span className="hidden md:inline">Comments</span>
            </span>
          </div>
        </div>

        <div 
          onClick={handleShare}
          className="flex items-center gap-3 bg-background p-2 rounded-xl cursor-pointer hover:bg-accent transition-colors"
        >
          <Image
            src="/share.png"
            alt=""
            width={20}
            height={20}
          />
          <span className="text-border">|</span>
          <span className="text-muted-foreground">
            {post?.share?.length}{" "}
            <span className="hidden md:inline">Shares</span>
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default PostCard;
