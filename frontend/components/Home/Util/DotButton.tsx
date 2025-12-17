"use client";
import { useFollowUnfollow } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { deletePost } from "@/store/postSlice";
import { Post, User } from "@/type";
import axios from "axios";
import {
  Bookmark,
  Ellipsis,
  UserCheck,
  UserCircleIcon,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { GoBookmarkSlash } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

type Props = {
  post: Post | null;
  user: User | null;
};

const DotButton = ({ post, user }: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const isOwnPost = post?.user?._id === user?._id;
  const isFollowing = post?.user?._id
    ? user?.following.includes(post.user._id)
    : false;

  // ✅ Fixed: Check if savedPosts contains the post ID
  const isPostSaved = user?.savedPosts && post?._id
    ? (user.savedPosts as string[]).includes(post._id)
    : false;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDeletePost = async () => {
    const deletePostReq = async () =>
      await axios.delete(`${BASE_API_URL}/posts/delete-post/${post?._id}`, {
        withCredentials: true,
      });
    const result = await handleAuthRequest(deletePostReq);
    if (result?.data.status === "success") {
      if (post?._id) {
        dispatch(deletePost(post?._id));
        toast.success(result?.data?.message);
        setShowDropdown(false);
        router.push("/");
      }
    }
  };

  const handleSaveUnsave = async (id: string) => {
    const result = await axios.post(
      `${BASE_API_URL}/posts/save-unsave-post/${id}`,
      {},
      { withCredentials: true }
    );

    if (result.data.status == "success") {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
    }
  };

  const handleFollowClick = () => {
    if (post?.user?._id) {
      handleFollowUnfollow(post.user._id);
    }
  };

  const handleViewProfile = () => {
    setShowDropdown(false);
    router.push(`/profile/${post?.user?._id}`);
  };

  if (post === null) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Image
        src="/more.png"
        alt="more"
        width={20}
        height={20}
        className="cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      />

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute -right-4 mt-2 w-48 bg-card rounded-lg shadow-lg border border-gray-300 py-2 z-50">
          {/* Follow/Unfollow - Only for other users' posts */}
          {!isOwnPost && (
            <>
              <button
                onClick={handleFollowClick}
                className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-foreground transition-colors"
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={18} />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Follow</span>
                  </>
                )}
              </button>
              <div className="border-t border-gray-200 my-1"></div>
            </>
          )}

          {/* View Profile */}
          <button
            onClick={handleViewProfile}
            className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-foreground transition-colors"
          >
            <UserCircleIcon size={18} />
            <span>{isOwnPost ? "My Profile" : "User Profile"}</span>
          </button>

          <div className="border-t border-gray-200 my-1"></div>

          {/* Save/Unsave Post - ✅ Simplified logic */}
          {isPostSaved ? (
            <button
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-foreground transition-colors"
              onClick={() => post?._id && handleSaveUnsave(post._id)}
            >
              <GoBookmarkSlash className="text-xl" />
              Unsave post
            </button>
          ) : (
            <button
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-foreground transition-colors"
              onClick={() => post?._id && handleSaveUnsave(post._id)}
            >
              <Bookmark size={20} />
              Save post
            </button>
          )}

          {/* Delete Post - Only for own posts */}
          {isOwnPost && (
            <>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleDeletePost}
                className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-red-600 transition-colors"
              >
                <MdDeleteOutline size={18} />
                <span>Delete Post</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DotButton;
