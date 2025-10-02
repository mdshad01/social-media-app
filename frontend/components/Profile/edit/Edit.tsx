"use client";
import { RootState } from "@/store/store";
import React, { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Edit = () => {
  const duspatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectImage, setSelectImage] = useState<string | null>(user?.profilePicture || null);
  const [bio, setBio] = useState(user?.bio || "");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {};
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {};
  const handleUpdateProfile = async () => {};

  const handlePasswordChange = async () => {};
  return <div>Edit</div>;
};

export default Edit;
