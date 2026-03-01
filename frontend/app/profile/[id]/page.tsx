// frontend/app/profile/[id]/page.tsx
"use client";
import Profile from "@/components/Profile/Profile";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { FullProfileSkeleton } from "@/components/Skeleton";
import React, { Suspense, use, useEffect } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ProfilePage = ({ params }: PageProps) => {
  const { id } = use(params);

  useEffect(() => {
    console.log("ProfilePage: Component mounted with ID:", id);
    console.log("ProfilePage: Window location:", window.location.href);
  }, [id]);

  console.log("ProfilePage: Rendering with ID:", id);

  return (
    <ProtectedRoute>
      <Suspense fallback={<FullProfileSkeleton />}>
        <Profile id={id} />
      </Suspense>
    </ProtectedRoute>
  );
};

export default ProfilePage;
