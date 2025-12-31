import Signup from "@/components/Auth/Signup";
import { SignupSkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const SignUpPage = () => {
  return (
    <Suspense fallback={<SignupSkeleton />}>
      <Signup />
    </Suspense>
  );
};

export default SignUpPage;
