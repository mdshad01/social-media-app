import Image from "next/image";
import Link from "next/link";
import React from "react";

const FriendRequests = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* USER */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Image
            src="https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg"
            alt=""
            height={40}
            width={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Kate Winslet</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4" />
          <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4" />
        </div>
      </div>
      {/* USER */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Image
            src="https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg"
            alt=""
            height={40}
            width={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Kate Winslet</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4" />
          <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4" />
        </div>
      </div>
      {/* USER */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Image
            src="https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg"
            alt=""
            height={40}
            width={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Kate Winslet</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/accept.png" alt="" width={16} height={16} className="w-4 h-4" />
          <Image src="/reject.png" alt="" width={16} height={16} className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
