"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Post, User } from "@/type";
import DotButton from "./DotButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useDispatch } from "react-redux";
import { likeOrDislike, addComment, likeComment, addReply, sharePost } from "@/store/postSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { handleAuthRequest } from "@/components/util/apiRequest";

type Props = {
  post: Post | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
};

const PostDetailModal = ({ post, user, isOpen, onClose }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-card rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        {/* Image container - fills space, no black bars */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {post?.image?.url && !post?.video && (
            <Image
              src={post.image.url}
              alt="Post image"
              fill
              className="w-full h-full object-contain"
              priority
              quality={100}
            />
          )}

          {post?.video?.url && (
            <video
              src={post.video.url}
              controls
              className="w-full h-full object-contain"
            />
          )}

          {!post?.image?.url && !post?.video?.url && post?.caption && (
            <div className="p-8 text-center">
              <p className="text-2xl text-foreground">{post.caption}</p>
            </div>
          )}
        </div>

        {/* Right panel - fixed width */}
        <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col bg-card max-h-[50vh] lg:max-h-full border-l border-border/50">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Image
                onClick={() => {
                  onClose();
                  router.push(`/profile/${post?.user?._id}`);
                }}
                src={post?.user?.profilePicture || "/noAvatar3.svg"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
              <span
                onClick={() => {
                  onClose();
                  router.push(`/profile/${post?.user?._id}`);
                }}
                className="font-semibold cursor-pointer hover:text-primary transition-colors"
              >
                {post?.user?.username}
              </span>
            </div>
            <DotButton post={post} user={user} />
          </div>

          <div className="flex-1 overflow-y-auto">
            {post?.caption && (
              <div className="p-4 border-b border-border">
                <div className="flex gap-3">
                  <Image
                    src={post?.user?.profilePicture || "/noAvatar3.svg"}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold mr-2">
                      {post?.user?.username}
                    </span>
                    <span className="text-foreground line-clamp-2">
                      {post.caption}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {post?.postType === "poll" && post?.poll && (
              <div className="p-4 border-b border-border space-y-2">
                <p className="font-semibold mb-3">{post.poll.question}</p>
                {(() => {
                  const totalVotes = post.poll!.options.reduce(
                    (sum, opt) => sum + opt.votes.length,
                    0
                  );

                  return (
                    <>
                      {post.poll!.options.map((option, index) => {
                        const percentage =
                          totalVotes > 0
                            ? (option.votes.length / totalVotes) * 100
                            : 0;
                        const hasVoted =
                          user?._id && option.votes.includes(user._id);

                        return (
                          <button
                            key={index}
                            onClick={() => handleVoteOnPoll(post._id, index)}
                            className={`w-full p-3 border border-border rounded-lg hover:bg-accent transition-colors ${
                              hasVoted ? "bg-primary/10 border-primary" : ""
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-left text-foreground">
                                {option.text}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {percentage.toFixed(0)}% ({option.votes.length})
                              </span>
                            </div>
                            {totalVotes > 0 && (
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    hasVoted
                                      ? "bg-primary"
                                      : "bg-muted-foreground/50"
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

            {post?.postType === "event" && post?.event && (
              <div className="p-4 border-b border-border">
                <div className="border-l-4 border-primary bg-primary/10 dark:bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-foreground">
                    {post.event.title}
                  </h3>
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

            <div className="p-4">
              {post?.comments?.map((item) => {
                const isLiked = user && item.likes?.includes(user._id);
                const replyCount = item.replies?.length || 0;

                return (
                  <div key={item._id} className="mb-4">
                    <div className="flex gap-3">
                      <Image
                        src={item?.user?.profilePicture || "/noAvatar.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full w-8 h-8 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="font-semibold text-sm">
                              {item?.user?.username}
                            </span>
                            <p className="text-sm mt-1">{item?.text}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span
                            onClick={() => handleLikeComment(item._id)}
                            className="cursor-pointer hover:text-foreground transition-colors flex items-center gap-1"
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
                            {item.likes?.length || 0} likes
                          </span>
                          <span
                            onClick={() => toggleReply(item._id)}
                            className="cursor-pointer hover:text-foreground transition-colors"
                          >
                            Reply {replyCount > 0 && `(${replyCount})`}
                          </span>
                        </div>

                        {item.replies && item.replies.length > 0 && (
                          <div className="mt-3 ml-6 space-y-3">
                            {item.replies.map((reply) => (
                              <div key={reply._id} className="flex gap-2">
                                <Image
                                  src={
                                    reply?.user?.profilePicture ||
                                    "/noAvatar.png"
                                  }
                                  alt=""
                                  width={24}
                                  height={24}
                                  className="rounded-full w-6 h-6 flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <span className="font-semibold text-xs">
                                    {reply?.user?.username}
                                  </span>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {reply?.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {replyTo === item._id && (
                          <div className="mt-3 ml-6">
                            <div className="flex items-center gap-2">
                              <Image
                                src={user?.profilePicture || "/noAvatar.png"}
                                alt=""
                                width={24}
                                height={24}
                                className="rounded-full w-6 h-6 cursor-pointer flex-shrink-0"
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
                                  className="cursor-pointer rounded-lg px-2 py-1 bg-primary text-white hover:bg-primary/90 transition-colors ml-2"
                                >
                                  post
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex gap-6">
                <div
                  onClick={() => handleLikeOrDislike(post._id)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {user?._id && post?.likes && post?.likes.includes(user._id) ? (
                    <Image src="/liked.png" alt="" width={24} height={24} />
                  ) : (
                    <Image src="/like.png" alt="" width={24} height={24} />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {post?.likes?.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Image src="/comment.png" alt="" width={24} height={24} />
                  <span className="text-sm text-muted-foreground">
                    {post?.comments?.length}
                  </span>
                </div>
              </div>

              <div 
                onClick={handleShare}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/share.png"
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="text-sm text-muted-foreground">
                  {post?.share?.length}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <Image
                  src={user?.profilePicture || "/noAvatar.png"}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8 cursor-pointer flex-shrink-0"
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
                    className="cursor-pointer rounded-lg px-3 py-1 bg-primary text-white hover:bg-primary/90 transition-colors ml-2"
                  >
                    post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
