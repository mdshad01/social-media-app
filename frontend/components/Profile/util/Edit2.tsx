import { RootState } from "@/store/store";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

const Edit2 = ({ setIsEdit }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileClick = () => {};

  return (
    <div className="fixed bg-black/20 opacity-20 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 relative">
        {/* Header */}
        <div className="stickey top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={() => setIsEdit((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Notification */}

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* BG image */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">Background Image</label>
            <div className="relative w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden group">
              {backgroundImagePreview ? (
                <img src={backgroundImagePreview} alt="Background" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg">
                  No background image
                </div>
              )}
              <button
                onClick={() => backgroundFileInputRef.current?.click()}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center text-white">
                  <Camera className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">Change Background</span>
                </div>
              </button>
              <input
                ref={backgroundFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit2;
