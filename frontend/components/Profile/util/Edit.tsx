"use client";
import { RootState } from "@/store/store";
import React, { ChangeEvent, useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { X, Camera, Upload, Loader2 } from "lucide-react";
import PasswordInput from "@/components/Auth/PasswordInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "@/components/util/apiRequest";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

const Edit = ({ setIsEdit }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // State for form fields
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(user?.profilePicture || null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(user?.backgroundImage || null);
  const [bio, setBio] = useState(user?.bio || "");
  const [city, setCity] = useState(user?.city || "");
  const [school, setSchool] = useState(user?.school || "");
  const [work, setWork] = useState(user?.work || "");
  const [website, setWebsite] = useState(user?.website || "");

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Loading and notification states
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Refs for file inputs
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement | null>(null);

  // Check if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      profilePictureFile !== null ||
      backgroundImageFile !== null ||
      bio !== (user?.bio || "") ||
      city !== (user?.city || "") ||
      school !== (user?.school || "") ||
      work !== (user?.work || "") ||
      website !== (user?.website || "") ||
      newPassword !== "" ||
      passwordConfirm !== "";

    setHasChanges(changed);
  }, [profilePictureFile, backgroundImageFile, bio, city, school, work, website, newPassword, passwordConfirm, user]);

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const formData = new FormData();

    // Append form fields
    if (bio) formData.append("bio", bio);
    if (city) formData.append("city", city);
    if (school) formData.append("school", school);
    if (work) formData.append("work", work);
    if (website) formData.append("website", website);

    // Append images if selected
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }
    if (backgroundImageFile) {
      formData.append("backgroundImage", backgroundImageFile);
    }

    const updateProfileReq = async () =>
      axios.post(`${BASE_API_URL}/users/edit-profile`, formData, { withCredentials: true });

    const result = await handleAuthRequest(updateProfileReq, setIsLoading);

    // const data = await response.json();

    if (result) {
      dispatch(setAuthUser(result?.data.data.user));
    }

    // Update Redux store with new user data
    // dispatch(setAuthUser(data.data.user));

    showNotification("success", "Profile updated successfully!");

    // Reset file states
    setProfilePictureFile(null);
    setBackgroundImageFile(null);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== passwordConfirm) {
      showNotification("error", "Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("error", "Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);
    try {
      // Add your password change API endpoint here
      const response = await fetch(`${BASE_API_URL}/users/change-password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
          passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      showNotification("success", "Password changed successfully!");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (error: any) {
      showNotification("error", error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);

    // Update profile
    if (
      profilePictureFile ||
      backgroundImageFile ||
      bio !== (user?.bio || "") ||
      city !== (user?.city || "") ||
      school !== (user?.school || "") ||
      work !== (user?.work || "") ||
      website !== (user?.website || "")
    ) {
      await handleUpdateProfile();
    }

    // Update password if provided
    if (newPassword && passwordConfirm) {
      await handlePasswordChange();
    }

    setIsLoading(false);
  };

  const handleDiscard = () => {
    if (hasChanges) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirm) return;
    }
    // Reset all fields to original values
    setProfilePictureFile(null);
    setBackgroundImageFile(null);
    setProfilePicturePreview(user?.profilePicture || null);
    setBackgroundImagePreview(user?.backgroundImage || null);
    setBio(user?.bio || "");
    setCity(user?.city || "");
    setSchool(user?.school || "");
    setWork(user?.work || "");
    setWebsite(user?.website || "");
    setNewPassword("");
    setPasswordConfirm("");

    // Close the edit form (you can modify this to trigger parent component's close function)
    window.history.back();
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-20 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex items-center justify-between z-10">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={() => setIsEdit((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mx-6 mt-4 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            {notification.message}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Background Image Section */}
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

          {/* Profile Picture Section */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group">
                {profilePicturePreview ? (
                  <img src={profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => profileFileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </button>
                <input
                  ref={profileFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>
              <button
                onClick={() => profileFileInputRef.current?.click()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Upload Photo
              </button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio about yourself..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
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
            <div className="space-y-4">
              <div>
                <PasswordInput
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  labelClassName="text-gray-700"
                />
              </div>
              <div>
                <PasswordInput
                  name="passwordConfirm"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  labelClassName="text-gray-700"
                />
              </div>
            </div>
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
          <button
            onClick={handleSaveAll}
            disabled={isLoading || !hasChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
