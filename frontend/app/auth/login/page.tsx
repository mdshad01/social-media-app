import Login from "@/components/Auth/Login";
import { LoginSkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
