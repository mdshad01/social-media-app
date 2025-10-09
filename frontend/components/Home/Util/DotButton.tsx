"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Post, User } from "@/type";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {
  post: Post | null;
  user: User | null;
};
const DotButton = ({ post, user }: Props) => {
  const isOwnPost = post?.user?._id == user?._id;
  const isFollowing = post?.user?._id ? user?.following.includes(post.user._id) : false;

  const dispatch = useDispatch();
  const handleDeletePost = async () => {};
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
              <Button variant={"secondary"}>About this acount</Button>
            </Link>
            {isOwnPost && (
              <Button variant={"destructive"} onClick={handleDeletePost}>
                delete
              </Button>
            )}
          </div>

          <DialogClose>cancel</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
