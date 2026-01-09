"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { Post } from "@/type";
import Image from "next/image";
import DotButton from "@/components/Home/Util/DotButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { HomeSkeleton } from "@/components/Skeleton";
import { MdDeleteOutline } from "react-icons/md";

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/posts/single/${params.id}`,
          { withCredentials: true }
        );
        if (response.data.status === "success") {
          setPost(response.data.data.post);
        }
      } catch {
        toast.error("Post not found");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, router]);

  const handleLikeOrDislike = async (id: string) => {
    const result = await axios.post(
      `${BASE_API_URL}/posts/like-dislike/${id}`,
      {},
      { withCredentials: true }
    );
    if (result.data.status === "success") {
      if (user?._id && post) {
        const updatedPost = { ...post };
        if (updatedPost.likes.includes(user._id)) {
          updatedPost.likes = updatedPost.likes.filter((id) => id !== user._id);
        } else {
          updatedPost.likes.push(user._id);
        }
        setPost(updatedPost);
        toast.success(result.data.message);
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
    if (result?.data.status === "success" && post) {
      const updatedPost = { ...post };
      updatedPost.comments.push(result.data.data.comment);
      setPost(updatedPost);
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
      const updatedPost = { ...post };
      const commentIndex = updatedPost.comments.findIndex((c) => c._id === commentId);
      if (commentIndex !== -1) {
        const comment = updatedPost.comments[commentIndex];
        if (comment.likes.includes(user._id)) {
          comment.likes = comment.likes.filter((id) => id !== user._id);
        } else {
          comment.likes.push(user._id);
        }
        setPost(updatedPost);
      }
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
      const updatedPost = { ...post };
      const commentIndex = updatedPost.comments.findIndex((c) => c._id === commentId);
      if (commentIndex !== -1) {
        if (!updatedPost.comments[commentIndex].replies) {
          updatedPost.comments[commentIndex].replies = [];
        }
        updatedPost.comments[commentIndex].replies.push(result.data.data.reply);
        setPost(updatedPost);
      }
      toast.success("Reply Posted.");
      setReplyText("");
      setReplyTo(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const deleteCommentReq = async () =>
      await axios.delete(`${BASE_API_URL}/posts/comment/${commentId}`, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(deleteCommentReq);
    if (result?.data.status === "success" && post) {
      const updatedPost = { ...post };
      updatedPost.comments = updatedPost.comments.filter((c) => c._id !== commentId);
      setPost(updatedPost);
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

  const handleShare = async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.user?.username}'s post`,
          text: post.caption || "Check out this post!",
          url: window.location.href,
        });

        try {
          const result = await axios.post(
            `${BASE_API_URL}/posts/share/${post._id}`,
            {},
            { withCredentials: true }
          );
          if (result.data.status === "success" && user?._id && post) {
            const updatedPost = { ...post };
            if (updatedPost.share.includes(user._id)) {
              updatedPost.share = updatedPost.share.filter((id) => id !== user._id);
            } else {
              updatedPost.share.push(user._id);
            }
            setPost(updatedPost);
          }
        } catch (error) {
          console.error("Failed to track share:", error);
        }

        toast.success("Shared successfully!");
      } catch (err) {
        const error = err as { name?: string };
        if (error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");

      try {
        const result = await axios.post(
          `${BASE_API_URL}/posts/share/${post._id}`,
          {},
          { withCredentials: true }
        );
        if (result.data.status === "success" && user?._id && post) {
          const updatedPost = { ...post };
          if (updatedPost.share.includes(user._id)) {
            updatedPost.share = updatedPost.share.filter((id) => id !== user._id);
          } else {
            updatedPost.share.push(user._id);
          }
          setPost(updatedPost);
        }
      } catch (error) {
        console.error("Failed to track share:", error);
      }
    }
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    );
  }

  const renderComments = () => {
    return post.comments.map((item) => {
      const isLiked = user && item.likes?.includes(user._id);
      const replyCount = item.replies?.length || 0;
      const isCommentOwner = user?._id === item.user._id;

      return (
        <div key={item._id} className="mb-4">
          <div className="flex gap-3">
            <Image
              src={item.user?.profilePicture || "/noAvatar.png"}
              alt=""
              width={32}
              height={32}
              className="rounded-full w-8 h-8 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="font-semibold text-sm">{item.user?.username}</span>
                  <p className="text-sm mt-1">{item.text}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <span
                  onClick={() => handleLikeComment(item._id)}
                  className="cursor-pointer hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {isLiked ? (
                    <Image src="/liked.png" alt="" width={12} height={12} />
                  ) : (
                    <Image src="/like.png" alt="" width={12} height={12} />
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
                        src={reply.user?.profilePicture || "/noAvatar.png"}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full w-6 h-6 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-xs">{reply.user?.username}</span>
                        <p className="text-xs text-muted-foreground mt-1">{reply.text}</p>
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
                      className="rounded-full w-6 h-6 flex-shrink-0"
                    />
                    <div className="flex items-center justify-between bg-accent rounded-xl text-xs px-3 py-2 flex-1">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        type="text"
                        placeholder={`Reply to ${item.user?.username}...`}
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
            {/* DELETE DROPDOWN - Only show for own comments */}
            {isCommentOwner && (
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
                  <div className="absolute right-0 mt-2 w-36 bg-card rounded-lg shadow-lg border border-border py-1 z-50 scale-95">
                    <button
                      onClick={() => handleDeleteComment(item._id)}
                      className="w-full px-3 py-1.5 text-left hover:bg-accent flex items-center gap-2 text-destructive transition-colors text-sm"
                    >
                      <MdDeleteOutline className="text-base" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {/* Desktop View - Instagram Style */}
      <div className="hidden lg:flex min-h-[90vh] bg-background items-center justify-center">
        <div className="w-full max-w-6xl max-h-[90vh] bg-card rounded-lg overflow-hidden flex shadow-2xl">
          <div className="relative flex-1 h-[85vh] bg-black flex items-center justify-center">
            {post.image?.url && !post.video && (
              <Image src={post.image.url} alt="Post" fill className="object-contain" priority quality={100} />
            )}
            {post.video?.url && <video src={post.video.url} controls className="w-full h-full object-contain" />}
            {!post.image?.url && !post.video?.url && post.caption && (
              <div className="p-8 text-center"><p className="text-2xl text-white">{post.caption}</p></div>
            )}
          </div>

          <div className="w-[450px] flex flex-col bg-card border-l border-border/50">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Image onClick={() => router.push(`/profile/${post.user?._id}`)} src={post.user?.profilePicture || "/noAvatar3.svg"} alt="" width={40} height={40} className="w-10 h-10 rounded-full cursor-pointer" />
                  <div className="flex flex-col">
                <span onClick={() => router.push(`/profile/${post.user?._id}`)} className="font-semibold cursor-pointer hover:text-primary">{post.user?.username}</span>
                <span onClick={() => router.push(`/profile/${post.user?._id}`)} className="cursor-pointer hover:text-primary text-sm">{post.user?.bio.slice(0,55) + "..."}</span>
                  </div>
              </div>
              <DotButton post={post} user={user} />
            </div>

            <div className="flex-1 overflow-y-auto">
              {post.caption && (
                <div className="p-4 border-b border-border">
                  <div className="flex">
                    <div><span className="text-foreground text-sm">{post.caption}</span></div>
                  </div>
                </div>
              )}
              <div className="p-4">{renderComments()}</div>
            </div>

            <div className="border-t border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex gap-6">
                  <div onClick={() => handleLikeOrDislike(post._id)} className="cursor-pointer flex items-center gap-2">
                    {user?._id && post.likes.includes(user._id) ? <Image src="/liked.png" alt="" width={24} height={24} /> : <Image src="/like.png" alt="" width={24} height={24} />}
                    <span className="text-sm text-muted-foreground">{post.likes.length}</span>
                  </div>
                  <div className="flex items-center gap-2"><Image src="/comment.png" alt="" width={24} height={24} /><span className="text-sm text-muted-foreground">{post.comments.length}</span></div>
                </div>
                <div onClick={handleShare} className="flex items-center gap-2 cursor-pointer"><Image src="/share.png" alt="" width={24} height={24} /><span className="text-sm text-muted-foreground">{post.share.length}</span></div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Image src={user?.profilePicture || "/noAvatar.png"} alt="" width={32} height={32} className="rounded-full w-8 h-8 flex-shrink-0" />
                  <div className="flex items-center justify-between bg-accent rounded-xl text-sm px-4 py-2 flex-1">
                    <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="Write a comment..." className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground" onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)} />
                    <button onClick={() => handleComment(post._id)} className="rounded-lg px-3 py-1 bg-primary text-white hover:bg-primary/90 ml-2">post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - LinkedIn Style */}
      <div className="lg:hidden min-h-screen bg-background">
        <div className="bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Image onClick={() => router.push(`/profile/${post.user?._id}`)} src={post.user?.profilePicture || "/noAvatar3.svg"} alt="" width={40} height={40} className="w-10 h-10 rounded-full cursor-pointer" />
              <div>
                <span onClick={() => router.push(`/profile/${post.user?._id}`)} className="font-semibold cursor-pointer">{post.user?.username}</span>
                {post.user?.bio && <p className="text-xs text-muted-foreground line-clamp-1">{post.user.bio}</p>}
              </div>
            </div>
            <DotButton post={post} user={user} />
          </div>

          {post.caption && <div className="p-4"><p className="text-foreground">{post.caption}</p></div>}
          {post.image?.url && !post.video && <Image src={post.image.url} alt="Post" width={800} height={600} className="w-full h-auto" />}
          {post.video?.url && <video src={post.video.url} controls className="w-full h-auto bg-black" />}

          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex gap-6">
              <div onClick={() => handleLikeOrDislike(post._id)} className="cursor-pointer flex items-center gap-2">
                {user?._id && post.likes.includes(user._id) ? <Image src="/liked.png" alt="" width={24} height={24} /> : <Image src="/like.png" alt="" width={24} height={24} />}
                <span className="text-sm text-muted-foreground">{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-2"><Image src="/comment.png" alt="" width={24} height={24} /><span className="text-sm text-muted-foreground">{post.comments.length}</span></div>
            </div>
            <div onClick={handleShare} className="flex items-center gap-2 cursor-pointer"><Image src="/share.png" alt="" width={24} height={24} /><span className="text-sm text-muted-foreground">{post.share.length}</span></div>
          </div>

          <div className="border-t border-border p-4">{renderComments()}</div>

          <div className="border-t border-border p-4 sticky bottom-0 bg-card">
            <div className="flex items-center gap-3">
              <Image src={user?.profilePicture || "/noAvatar.png"} alt="" width={32} height={32} className="rounded-full w-8 h-8 flex-shrink-0" />
              <div className="flex items-center justify-between bg-accent rounded-xl text-sm px-4 py-2 flex-1">
                <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="Write a comment..." className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground" onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)} />
                <button onClick={() => handleComment(post._id)} className="rounded-lg px-3 py-1 bg-primary text-white hover:bg-primary/90 ml-2">post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;
