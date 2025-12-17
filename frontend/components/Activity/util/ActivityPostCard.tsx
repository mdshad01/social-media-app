"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// Union type for all possible post structures in activities
type ActivityPostData = 
  | {
      _id: string;
      caption: string;
      image?: {
        url: string;
        publicId: string;
      };
      user?: never;
    }
  | {
      _id: string;
      caption: string;
      image?: {
        url: string;
        publicId: string;
      };
      user: string;
    }
  | {
      _id: string;
      caption: string;
      image?: {
        url: string;
        publicId: string;
      };
      user: {
        _id: string;
        username: string;
        profilePicture: string;
      };
    };

type Props = {
  post: ActivityPostData;
  showUser?: boolean; // Optional: show user info if available
};

const ActivityPostCard: React.FC<Props> = ({ post, showUser = true }) => {
  const router = useRouter();

  // Check if user is an object (not just string ID)
  const hasUserObject = post.user && typeof post.user === "object";

  return (
    <div className="flex flex-col gap-4 bg-card py-4 rounded-md">
      {/* USER - Only show if user data is available as object */}
      {showUser && hasUserObject && (
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Image
              onClick={() => router.push(`/profile/${post.user._id}`)}
              src={
                post.user.profilePicture ||
                "https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"
              }
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
            <span
              onClick={() => router.push(`/profile/${post.user._id}`)}
              className="font-medium cursor-pointer"
            >
              {post.user.username}
            </span>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col gap-4">
        {/* Caption */}
        {post.caption && (
          <p className="px-4 text-foreground">{post.caption}</p>
        )}

        {/* IMAGE */}
        {post.image?.url && (
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

        {/* No image placeholder */}
        {!post.image?.url && !post.caption && (
          <div className="px-4 text-muted-foreground text-center py-8">
            <p>No content available</p>
          </div>
        )}
      </div>

      {/* Simple info footer - no interactions since we don't have likes/comments data */}
      <div className="px-4 text-sm text-muted-foreground">
        <p>Post ID: {post._id.slice(-6)}</p>
      </div>
    </div>
  );
};

export default ActivityPostCard;
