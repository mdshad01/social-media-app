import PasswordInput from "@/components/Auth/PasswordInput";
import LoadingButton from "@/components/Helper/LoadingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

const Edit2 = ({ setIsEdit }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePicture || null);
  const [banner, setBanner] = useState<string | null>(user?.backgroundImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [city, setCity] = useState(user?.city || "");
  const [school, setSchool] = useState(user?.school || "");
  const [work, setWork] = useState(user?.work || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      profileImage !== null ||
      banner !== null ||
      // bio !== (user?.bio || "") ||
      // city !== (user?.city || "") ||
      // school !== (user?.school || "") ||
      // work !== (user?.work || "") ||
      // website !== (user?.website || "") ||
      newPassword !== "" ||
      passwordConfirm !== "";

    setHasChanges(changed);
  }, [profileImage, banner, bio, currentPassword, newPassword, passwordConfirm, user]);

  const handleProfileClick = () => {
    if (profileInputRef.current) profileInputRef.current.click();
  };

  const handleBannerClick = () => {
    if (bannerInputRef.current) bannerInputRef.current.click();
  };

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBanner(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    if (bio) formData.append("bio", bio);
    if (city) formData.append("city", city);
    if (school) formData.append("school", school);
    if (work) formData.append("work", work);
    if (website) formData.append("website", website);

    if (profileInputRef.current?.files?.[0]) {
      formData.append("profilePicture", profileInputRef.current?.files?.[0]);
    }
    if (bannerInputRef.current?.files?.[0]) {
      formData.append("backgroundImage", bannerInputRef.current?.files?.[0]);
    }

    const updateProfileReq = async () =>
      await axios.post(`${BASE_API_URL}/users/edit-profile`, formData, { withCredentials: true });

    const result = await handleAuthRequest(updateProfileReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      setIsEdit(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
  };
  const handleDiscard = () => {
    if (hasChanges) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirm) return;
    }
    // Reset all fields to original values
    setProfileImage(null);
    setBanner(null);
    // setBio(user?.bio || "");
    // setCity(user?.city || "");
    // setSchool(user?.school || "");
    // setWork(user?.work || "");
    // setWebsite(user?.website || "");
    setCurrentPassword("");
    setNewPassword("");
    setPasswordConfirm("");

    setIsEdit(false);
  };

  return (
    <div className="fixed bg-black/20 bg-opacity-20 z-50 flex items-center justify-center p-4 overflow-y-auto inset-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 relative">
        {/* Header */}
        <div className="stickey top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex items-center justify-between">
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
            <div className="relative w-[80%] h-60 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden group">
              {banner ? (
                <Image src={banner} alt="Background" fill className=" object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg">
                  No background image
                </div>
              )}
              <button
                onClick={handleBannerClick}
                className="absolute inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center text-white">
                  <Camera className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">Change Background</span>
                </div>
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="">
                <div
                  onClick={handleProfileClick}
                  className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg group">
                  <Avatar className="w-36 h-36">
                    <AvatarImage src={profileImage || ""} />
                    <AvatarFallback>
                      <Camera />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          {/* Bio Section  */}
          <div className="space-y-2">
            <label htmlFor="bio" className="font-semibold text-gray-700 block">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio about yourself..."
              rows={4}
              className="w-[80%] h-42 px-4 py-3 rounded-lg bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
            <LoadingButton
              className="bg-blue-600 text-white hover:bg-blue-700 block transition-colors font-medium mt-2"
              isLoading={isLoading}
              onClick={handleUpdateProfile}
              size={"lg"}>
              Change Bio
            </LoadingButton>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* School */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">School</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter your school or university"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Work */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">Work</label>
            <input
              type="text"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              placeholder="Enter your current work or company"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Password Change Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
            <form action="" className="" onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div className="w-[90%] md:w-[80%] lg:w-[55%]">
                  <PasswordInput
                    name="currentPassword"
                    label="Current Password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    labelClassName="text-gray-700"
                  />
                </div>
                <div className="w-[90%] md:w-[80%] lg:w-[55%]">
                  <PasswordInput
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    labelClassName="text-gray-700"
                  />
                </div>
                <div className="w-[90%] md:w-[80%] lg:w-[55%]">
                  <PasswordInput
                    name="passwordConfirm"
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    labelClassName="text-gray-700"
                  />
                </div>
                <div className="">
                  <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                    Change Password
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg flex items-center justify-end gap-3">
          <button
            onClick={handleDiscard}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <LoadingButton
            isLoading={isLoading}
            size={"lg"}
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default Edit2;
