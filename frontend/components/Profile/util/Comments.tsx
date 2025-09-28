import Image from "next/image";
import React from "react";

const Comments = () => {
  return (
    <div>
      {/* WRITE */}
      <div className="flex items-center gap-4">
        <Image
          src="https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"
          alt=""
          width={32}
          height={32}
          className="rounded-full w-8 h-8 cursor-pointer "
        />
        <div className="flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-[90%]">
          <input type="text" placeholder="write a comment..." className="bg-transparent outline-none flex-1" />
          <Image src="/emoji.png" alt="" height={16} width={16} className="cursor-pointer h-4 w-4" />
        </div>
      </div>
      {/* COMMENTS */}
      <div className="">
        {/* COMMENT */}
        <div className="flex justify-between gap-4 mt-6 ">
          {/* AVATAR */}
          <Image
            src="https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"
            alt=""
            width={40}
            height={40}
            className="rounded-full w-10 h-10 cursor-pointer"
          />
          {/* DESC */}
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-medium">Jhon Carter</span>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo, necessitatibus.</p>
            <div className="flex items-center gap-8 text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <Image src="/like.png" alt="" width={12} height={12} className="w-3 h-3 cursor-pointer" />
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">256 Likes</span>
              </div>
              <div className="">Replay</div>
            </div>
          </div>
          {/* MORE */}
          <Image src="/more.png" alt="" width={16} height={16} className="w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Comments;
