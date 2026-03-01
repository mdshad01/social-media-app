"use client";
import React from 'react'
import SavedPost from "@/components/Home/Util/SavedPost";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

const SavedPostPage = () => {
  return (
    <ProtectedRoute>
      <SavedPost />
    </ProtectedRoute>
  )
}

export default SavedPostPage