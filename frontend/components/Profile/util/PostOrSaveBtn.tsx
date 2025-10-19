import { cn } from "@/lib/utils";
import { Bookmark, Grid } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { IoGridOutline } from "react-icons/io5";

type Props = {
  postOrSave: string;
  setPostOrSave: Dispatch<SetStateAction<string>>;
  isProfileOwn: boolean;
};

const PostOrSaveBtn = ({ postOrSave, setPostOrSave, isProfileOwn }: Props) => {
  return (
    <div className="mt-10 flex gap-10 items-center justify-center bg-white h-[8vh] rounded-lg">
      <div className="flex items-center justify-center space-x-12">
        <div
          className={cn(
            "flex items-center space-x-2 cursor-pointer text-gray-600",
            postOrSave === "POST" && "text-black"
          )}
          onClick={() => setPostOrSave("POST")}>
          <IoGridOutline size={20} />
          <span className="font-medium">Post</span>
        </div>
      </div>
      {isProfileOwn && (
        <div className="flex items-center justify-center space-x-12">
          <div
            className={cn(
              "flex items-center space-x-2 cursor-pointer text-gray-600",
              postOrSave === "SAVE" && "text-black"
            )}
            onClick={() => setPostOrSave("SAVE")}>
            <Bookmark size={20} />
            <span className="font-medium">Save</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostOrSaveBtn;
