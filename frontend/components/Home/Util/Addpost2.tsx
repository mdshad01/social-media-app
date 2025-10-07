import { RootState } from "@/store/store";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import CreatePostModal from "./CreatePostModal";

const Addpost2 = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<"photo" | "video" | "poll" | "event" | null>(null);

  const handleOpenModal = (mediaType?: "photo" | "video" | "poll" | "event") => {
    setActiveMediaType(mediaType || null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
        {/* AVATAR */}
        <Image
          src={user?.profilePicture || "https://images.pexels.com/photos/16654239/pexels-photo-16654239.jpeg"}
          alt=""
          height={48}
          width={48}
          className="w-12 h-12 object-cover rounded-full"
        />
        {/* POST */}
        <div className="flex-1">
          {/*  TEXT INPUT*/}
          <div className="flex gap-4">
            <div
              onClick={() => handleOpenModal()}
              className="bg-slate-100 rounded-lg flex-1 p-2 cursor-pointer hover:bg-slate-200 transition-colors">
              <span className="text-gray-500">What&apos;s on your mind?</span>
            </div>
            <Image src="/emoji.png" alt="" height={20} width={20} className="w-5 h-5 cursor-pointer self-end" />
          </div>
          {/* POST OPTIONS */}
          <div className="flex items-center gap-6 mt-4 text-black flex-wrap">
            <div
              onClick={() => handleOpenModal("photo")}
              className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <Image src="/addimage.png" alt="" height={20} width={20} className="w-5 h-5 cursor-pointer self-end" />
              Photo
            </div>
            <div
              onClick={() => handleOpenModal("video")}
              className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <Image src="/addvideo.png" alt="" height={20} width={20} className="w-5 h-5 cursor-pointer self-end" />
              Video
            </div>
            <div
              onClick={() => handleOpenModal("poll")}
              className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <Image src="/poll.png" alt="" height={20} width={20} className="w-5 h-5 cursor-pointer self-end" />
              Poll
            </div>
            <div
              onClick={() => handleOpenModal("event")}
              className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <Image src="/addevent.png" alt="" height={20} width={20} className="w-5 h-5 cursor-pointer self-end" />
              Event
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialMediaType={activeMediaType}
          user={user}
        />
      )}
    </>
  );
};

export default Addpost2;
