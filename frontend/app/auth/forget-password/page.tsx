import ForgetPassword from "@/components/Auth/ForgetPassword";
import { ForgetPasswordSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

const ForgetPasswordPage = () => {
  return (
    <Suspense fallback={<ForgetPasswordSkeleton />}>
      <ForgetPassword />
    </Suspense>
  );
};

export default ForgetPasswordPage;
