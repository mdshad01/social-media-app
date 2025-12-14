import { RootState } from "@/store/store";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const Addpost = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={
          user?.profilePicture ||
          "https://images.pexels.com/photos/16654239/pexels-photo-16654239.jpeg"
        }
        alt=""
        height={48}
        width={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/*  TEXT INPUT*/}
        <div className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="bg-slate-100 rounded-lg flex-1 p-2"
          ></textarea>
          <Image
            src="/emoji.png"
            alt=""
            height={20}
            width={20}
            className="w-5 h-5 cursor-pointer self-end"
          />
        </div>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-6 mt-4 text-black flex-wrap">
          <div className="flex gap-1 items-center cursor-pointer">
            <Image
              src="/addimage.png"
              alt=""
              height={20}
              width={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            {/* <TbPhoto className="text-2xl" /> */}
            Photo
          </div>
          <div className="flex gap-1 items-center cursor-pointer">
            <Image
              src="/addvideo.png"
              alt=""
              height={20}
              width={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            {/* <RxVideo className="text-2xl" /> */}
            Video
          </div>
          <div className="flex gap-1 items-center cursor-pointer">
            <Image
              src="/poll.png"
              alt=""
              height={20}
              width={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            {/* <MdOutlinePoll className="text-2xl" /> */}
            Poll
          </div>
          <div className="flex gap-1 items-center cursor-pointer">
            <Image
              src="/addevent.png"
              alt=""
              height={20}
              width={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            {/* <MdEventNote className="text-2xl" /> */}
            Event
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addpost;
