import { Post, User } from "@/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  userProfile: User | undefined;
};

const UserMediaCart = ({ userProfile }: Props) => {
  console.log(userProfile?.savedPosts);
  const savedPosts = userProfile?.savedPosts as Post[] | undefined;
  return (
    <div className="p-4 bg-card rounded-lg shadow-md text-sm min-w-[19rem]">
      {/* TOP */}
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">Saved Posts</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-wrap mt-4 justify-between gap-4">
        {savedPosts &&
          savedPosts.length > 0 &&
          savedPosts?.map((post) => (
            <div key={post?._id} className="relative w-1/5 h-24">
              {post?.image?.url && (
                <Image
                  src={post?.image?.url}
                  alt=""
                  fill
                  className="object-cover rounded-md"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserMediaCart;
