"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Post, User } from "@/type";
import DotButton from "./DotButton";
import PostDetailModal from "./PostDetailModal";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useDispatch } from "react-redux";
import { likeOrDislike, sharePost, addComment, likeComment, addReply, deleteComment } from "@/store/postSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { MdDeleteOutline } from "react-icons/md";

type Props = {
  post: Post | null;
  index?: number;
  user: User | null;
};

const PostCard = ({ post, user }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        } catch {
          console.error("Failed to track share");
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
      } catch {
        console.error("Failed to track share");
      }
    }
  };

  const handleComment = async (id: string) => {
    if (!comment) return;
    const addCommentReq = async () =>
      await axios.post(
        `${BASE_API_URL}/posts/comment/${id}`,
        { text: comment },
        { withCredentials: true }
      );

    const result = await handleAuthRequest(addCommentReq);
    if (result?.data.status === "success") {
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
    if (result?.data.status === "success" && user && post) {
      dispatch(likeComment({ postId: post._id, commentId, userId: user._id }));
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
    if (result?.data.status === "success" && post) {
      dispatch(
        addReply({
          postId: post._id,
          commentId,
          reply: result.data.data.reply,
        })
      );
      toast.success("Reply Posted.");
      setReplyText("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const deleteCommentReq = async () =>
      await axios.delete(`${BASE_API_URL}/posts/comment/${commentId}`, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(deleteCommentReq);
    if (result?.data.status === "success" && post) {
      dispatch(deleteComment({ postId: post._id, commentId }));
      toast.success("Comment deleted.");
      setOpenDropdown(null);
    }
  };

  const toggleReply = (commentId: string) => {
    if (replyTo === commentId) {
      setReplyTo(null);
      setReplyText("");
    } else {
      setReplyTo(commentId);
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
    } catch {
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
    } catch {
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
            onClick={() => setShowComments(!showComments)}
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

      {/* INLINE COMMENTS SECTION */}
      {showComments && (
        <div className="px-4 border-t border-border/50 pt-4">
          {/* WRITE COMMENT */}
          <div className="flex items-center gap-4">
            <Image
              src={user?.profilePicture || "/noAvatar.png"}
              alt=""
              width={32}
              height={32}
              className="rounded-full w-8 h-8 cursor-pointer"
            />
            <div className="flex items-center justify-between bg-accent rounded-xl text-sm px-4 py-2 flex-1">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="write a comment..."
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(post._id);
                  }
                }}
              />
              <button
                onClick={() => handleComment(post._id)}
                className="cursor-pointer rounded-lg px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                post
              </button>
            </div>
          </div>

          {/* COMMENTS LIST */}
          <div className="mt-4">
            {post?.comments?.map((item) => {
              const isLiked = user && item.likes?.includes(user._id);
              const replyCount = item.replies?.length || 0;

              return (
                <div key={item._id}>
                  <div className="flex justify-between gap-4 mt-4">
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
                              <Image src="/liked.png" alt="" width={12} height={12} className="w-3 h-3" />
                            ) : (
                              <Image src="/like.png" alt="" width={12} height={12} className="w-3 h-3" />
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

                      {/* REPLIES AND INPUT */}
                      {replyTo === item._id && (
                        <div className="mt-4">
                          {/* EXISTING REPLIES */}
                          {item.replies && item.replies.length > 0 && (
                            <div className="ml-6 mb-4 space-y-4">
                              {item.replies.map((reply) => (
                                <div key={reply._id} className="flex gap-3">
                                  <Image
                                    src={reply?.user?.profilePicture || "/noAvatar.png"}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="rounded-full w-8 h-8 cursor-pointer"
                                  />
                                  <div className="flex flex-col gap-1 flex-1">
                                    <span className="font-medium text-sm">{reply?.user?.username}</span>
                                    <p className="text-sm text-muted-foreground">{reply?.text}</p>
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
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handlePostReply(item._id);
                                  }
                                }}
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
                    {/* DELETE - Only show for own comments */}
                    {user?._id === item.user._id && (
                      <div className="relative" ref={openDropdown === item._id ? dropdownRef : null}>
                        <Image
                          src="/more.png"
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => setOpenDropdown(openDropdown === item._id ? null : item._id)}
                        />
                        {openDropdown === item._id && (
                          <div className="absolute right-0 mt-2 w-40 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
                            <button
                              onClick={() => handleDeleteComment(item._id)}
                              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-destructive transition-colors"
                            >
                              <MdDeleteOutline className="text-lg" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default PostCard;
