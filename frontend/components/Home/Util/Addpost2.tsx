import { RootState } from "@/store/store";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CreatePostModal2 from "./CreatePostModal2";
import { useRouter } from "next/navigation";
import { ImagePlus, Video, BarChart3, Calendar } from "lucide-react";

const Addpost2 = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (
    mediaType?: "photo" | "video" | "poll" | "event"
  ) => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-4 bg-card shadow-md rounded-md border border-border/50 hover:shadow-lg transition-shadow duration-300">
        {/* POST */}
        <div className="flex-1">
          <div className="flex gap-4 ">
            {/* AVATAR */}
            <Image
              onClick={() => router.push(`/profile/${user?._id}`)}
              src={
                user?.profilePicture ||
                "/noAvatar3.svg"
              }
              alt=""
              height={48}
              width={48}
              className="w-12 h-12 object-cover rounded-full ring-2 ring-border cursor-pointer hover:ring-primary/50 transition-all"
            />
            {/*  TEXT INPUT*/}
            <div
              onClick={() => handleOpenModal()}
              className="bg-muted/90 rounded-full flex-1 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-all border border-border/50"
            >
              <span className="text-muted-foreground/90 text-sm font-medium">
                What&apos;s on your mind?
              </span>
            </div>
          </div>
          {/* POST OPTIONS */}
          <div className="flex items-center gap-2 mt-4 text-foreground flex-wrap md:pl-15">
            <button
              onClick={() => handleOpenModal("photo")}
              className="flex gap-1.5 items-center cursor-pointer hover:bg-primary/10 px-2.5 py-2 rounded-lg transition-all text-xs font-medium text-primary hover:scale-105"
            >
              <ImagePlus className="w-4 h-4" />
              <span className="inline">Photo</span>
            </button>
            <button
              onClick={() => handleOpenModal("video")}
              className="flex gap-1.5 items-center cursor-pointer hover:bg-green-500/10 px-2.5 py-2 rounded-lg transition-all text-xs font-medium text-green-600 hover:scale-105"
            >
              <Video className="w-4 h-4" />
              <span className="inline">Video</span>
            </button>
            <button
              onClick={() => handleOpenModal("poll")}
              className="flex gap-1.5 items-center cursor-pointer hover:bg-orange-500/10 px-2.5 py-2 rounded-lg transition-all text-xs font-medium text-orange-600 hover:scale-105"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="inline">Poll</span>
            </button>
            <button
              onClick={() => handleOpenModal("event")}
              className="flex gap-1.5 items-center cursor-pointer hover:bg-purple-500/10 px-2.5 py-2 rounded-lg transition-all text-xs font-medium text-purple-600 hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              <span className="inline">Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && user && (
        <CreatePostModal2
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
        />
      )}
    </>
  );
};

export default Addpost2;
