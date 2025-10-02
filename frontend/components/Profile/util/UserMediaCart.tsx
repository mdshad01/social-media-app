import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserMediaCart = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm min-w-[19rem]">
      {/* TOP */}
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-wrap mt-4 justify-between gap-4">
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-1/5 h-24">
          <Image
            src="https://images.pexels.com/photos/32529987/pexels-photo-32529987.jpeg"
            alt=""
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default UserMediaCart;
