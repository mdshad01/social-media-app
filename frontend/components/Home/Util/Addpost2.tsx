import { RootState } from "@/store/store";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import CreatePostModal from "./CreatePostModal";
import CreatePostModal2 from "./CreatePostModal2";
import { useRouter } from "next/navigation";

const Addpost2 = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<
    "photo" | "video" | "poll" | "event" | null
  >(null);

  const handleOpenModal = (
    mediaType?: "photo" | "video" | "poll" | "event"
  ) => {
    setActiveMediaType(mediaType || null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-4 bg-card shadow-lg rounded-xl border border-border/50 flex gap-4 justify-between text-sm">
        {/* POST */}
        <div className="flex-1">
          <div className="flex gap-4">
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
              className="w-12 h-12 object-cover rounded-full"
            />
            {/*  TEXT INPUT*/}
            <div
              onClick={() => handleOpenModal()}
              className="bg-background rounded-xl flex-1 p-3 cursor-pointer  hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground">
                What&apos;s on your mind?
              </span>
            </div>
            {/* <Image src="/emoji.png" alt="" height={20} width={20} className="w-5 h-5 cursor-pointer self-end" /> */}
          </div>
          {/* POST OPTIONS */}
          <div className="flex items-center justify-between sm:justify-start md:pl-16 md:justify-start sm:gap-6 mt-4 text-foreground  flex-wrap">
            <div
              onClick={() => handleOpenModal("photo")}
              className="flex gap-1 items-center cursor-pointer hover:bg-accent  p-2 rounded-lg transition-colors"
            >
              <Image
                src="/addimage.png"
                alt=""
                height={20}
                width={20}
                className="w-5 h-5 cursor-pointer self-end"
              />
              Photo
            </div>
            <div
              onClick={() => handleOpenModal("video")}
              className="flex gap-1 items-center cursor-pointer hover:bg-accent  p-2 rounded-lg transition-colors"
            >
              <Image
                src="/addVideo.png"
                alt=""
                height={20}
                width={20}
                className="w-5 h-5 cursor-pointer self-end"
              />
              Video
            </div>
            <div
              onClick={() => handleOpenModal("poll")}
              className="flex gap-1 items-center cursor-pointer hover:bg-accent  p-2 rounded-lg transition-colors"
            >
              <Image
                src="/poll.png"
                alt=""
                height={20}
                width={20}
                className="w-5 h-5 cursor-pointer self-end"
              />
              Poll
            </div>
            <div
              onClick={() => handleOpenModal("event")}
              className="flex gap-1 items-center cursor-pointer hover:bg-accent  p-2 rounded-lg transition-colors"
            >
              <Image
                src="/addevent.png"
                alt=""
                height={20}
                width={20}
                className="w-5 h-5 cursor-pointer self-end"
              />
              Event
            </div>
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
        // <CreatePostModal
        //   isOpen={isModalOpen}
        //   initialMediaType={activeMediaType}
        //   onClose={() => setIsModalOpen(false)}
        //   user={user}
        // />
      )}
    </>
  );
};

export default Addpost2;
