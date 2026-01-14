import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserPlus, UserCheck } from "lucide-react";

const FriendRequests = () => {
  return (
    <div className="p-4 bg-card rounded-xl shadow-md border border-border/50 text-sm hover:shadow-lg transition-shadow duration-300">
      {/* TOP */}
      <div className="flex items-center justify-between font-medium mb-4">
        <span className="text-foreground font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Friend Requests
        </span>
        <Link href="/" className="text-primary text-xs hover:text-primary/80 transition-colors font-medium">
          See all
        </Link>
      </div>
      {/* USER */}
      <div className="mt-3 flex items-center justify-between hover:bg-accent/70 p-3 rounded-xl transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg"
              alt=""
              height={40}
              width={40}
              className="w-10 h-10 rounded-full ring-2 ring-border group-hover:ring-primary/40 transition-all"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          </div>
          <span className="font-medium text-foreground">Kate Winslet</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-primary/10 hover:bg-primary hover:scale-110 rounded-full transition-all duration-200 group/btn">
            <UserCheck className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors" />
          </button>
          <button className="p-2 bg-destructive/10 hover:bg-destructive hover:scale-110 rounded-full transition-all duration-200 group/btn">
            <Image
              src="/reject.png"
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 opacity-70 group-hover/btn:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </div>
      {/* USER */}
      <div className="mt-3 flex items-center justify-between hover:bg-accent/70 p-3 rounded-xl transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg"
              alt=""
              height={40}
              width={40}
              className="w-10 h-10 rounded-full ring-2 ring-border group-hover:ring-primary/40 transition-all"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          </div>
          <span className="font-medium text-foreground">Kate Winslet</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-primary/10 hover:bg-primary hover:scale-110 rounded-full transition-all duration-200 group/btn">
            <UserCheck className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors" />
          </button>
          <button className="p-2 bg-destructive/10 hover:bg-destructive hover:scale-110 rounded-full transition-all duration-200 group/btn">
            <Image
              src="/reject.png"
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 opacity-70 group-hover/btn:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </div>
      {/* USER */}
      <div className="mt-3 flex items-center justify-between hover:bg-accent/70 p-3 rounded-xl transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg"
              alt=""
              height={40}
              width={40}
              className="w-10 h-10 rounded-full ring-2 ring-border group-hover:ring-primary/40 transition-all"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          </div>
          <span className="font-medium text-foreground">Kate Winslet</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-primary/10 hover:bg-primary hover:scale-110 rounded-full transition-all duration-200 group/btn">
            <UserCheck className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors" />
          </button>
          <button className="p-2 bg-destructive/10 hover:bg-destructive hover:scale-110 rounded-full transition-all duration-200 group/btn">
            <Image
              src="/reject.png"
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 opacity-70 group-hover/btn:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
