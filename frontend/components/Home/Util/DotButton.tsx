"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { Post, User } from "@/type";
import axios from "axios";
import { Bookmark, Delete, Ellipsis, UserCircleIcon, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

type Props = {
  post: Post | null;
  user: User | null;
};
const DotButton = ({ post, user }: Props) => {
  const isOwnPost = post?.user?._id == user?._id;
  const isFollowing = post?.user?._id ? user?.following.includes(post.user._id) : false;

  const dispatch = useDispatch();
  const handleDeletePost = async () => {};
  const handleSaveUnsave = async (id?: string) => {
    const result = await axios.post(`${BASE_API_URL}/posts/save-unsave/${id}`);

    if (result.data.status == "success") {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
    }
  };
  return (
    <div className="max-w-xs">
      <Dialog>
        <DialogTrigger>
          <Ellipsis className="w-6 h-6 text-gray-900 cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <div className="flex flex-col items-center justify-center w-fit space-y-4 mx-auto">
            {!isOwnPost && (
              <div className="">
                <Button variant={isFollowing ? "destructive" : "secondary"}>
                  {isFollowing ? "Unfollow" : "follow"}
                </Button>
              </div>
            )}
            <Link href={`/profile/${post?.user?._id}`}>
              <Button variant={"secondary"}>
                <UserCircleIcon size={20} />
                User profile
              </Button>
            </Link>
            <Link href={`/profile/${post?.user?._id}`}>
              <Button onClick={() => handleSaveUnsave(post?._id)} variant={"secondary"}>
                {" "}
                <Bookmark size={20} />
                Save post
              </Button>
            </Link>
            {isOwnPost && (
              <Button variant={"destructive"} onClick={handleDeletePost}>
                <MdDeleteOutline className="text-xl" />
                Delete post
              </Button>
            )}
          </div>
          <DialogClose>
            <span className="flex items-center justify-center gap-1 mx-auto">
              <X size={20} />
              cancel
            </span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
