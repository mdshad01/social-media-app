"use client";

// Skeleton base component
const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
};

// Login Page Skeleton
export const LoginSkeleton = () => {
  return (
    <div className="w-full h-[100vh] overflow-hidden bg-background">
      <div className="flex flex-col lg:flex-row justify-between pr-12">
        {/* Banner Skeleton */}
        <div className="lg:w-[55%] h-screen hidden lg:block relative">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        {/* Form Skeleton */}
        <div className="lg:w-[42%] h-screen p-8">
          <div className="h-full w-full flex flex-col items-center justify-center bg-primary/10 dark:bg-card rounded-lg relative overflow-hidden">
            {/* Title */}
            <Skeleton className="h-8 w-64 mb-8" />

            {/* Form Fields */}
            <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]">
              {/* Email Label */}
              <Skeleton className="h-5 w-16 mb-2" />
              {/* Email Input */}
              <Skeleton className="h-14 w-full mb-4 rounded-lg" />

              {/* Password Label */}
              <Skeleton className="h-5 w-20 mb-2" />
              {/* Password Input */}
              <Skeleton className="h-14 w-full mb-2 rounded-lg" />
              {/* Forget Password Link */}
              <Skeleton className="h-4 w-32 ml-auto mb-4" />

              {/* Submit Button */}
              <Skeleton className="h-12 w-full mt-3 rounded-lg" />
            </div>

            {/* Signup Link */}
            <Skeleton className="h-5 w-56 mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Page Skeleton
export const SignupSkeleton = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <div className="flex flex-col lg:flex-row justify-between pr-12">
        {/* Banner Skeleton */}
        <div className="lg:w-[55%] h-screen hidden lg:block relative">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        {/* Form Skeleton */}
        <div className="lg:w-[42%] h-screen p-8">
          <div className="h-full w-full flex flex-col items-center justify-center bg-primary/10 dark:bg-card rounded-lg relative overflow-hidden">
            {/* Title */}
            <Skeleton className="h-8 w-64 mb-8" />

            {/* Form Fields */}
            <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]">
              {/* Username */}
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-14 w-full mb-4 rounded-lg" />

              {/* Email */}
              <Skeleton className="h-5 w-16 mb-2" />
              <Skeleton className="h-14 w-full mb-4 rounded-lg" />

              {/* Password */}
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-14 w-full mb-4 rounded-lg" />

              {/* Confirm Password */}
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-14 w-full mb-4 rounded-lg" />

              {/* Submit Button */}
              <Skeleton className="h-12 w-full mt-3 rounded-lg" />
            </div>

            {/* Login Link */}
            <Skeleton className="h-5 w-48 mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Verify OTP Skeleton
export const VerifySkeleton = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-background">
      {/* Icon */}
      <Skeleton className="w-20 h-20 sm:h-32 sm:w-32 rounded-full mb-12" />

      {/* Title */}
      <Skeleton className="h-8 w-48 mb-3" />

      {/* Subtitle */}
      <Skeleton className="h-5 w-64 mb-6" />

      {/* OTP Inputs */}
      <div className="flex space-x-4">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Skeleton
            key={index}
            className="w-10 h-10 sm:h-24 sm:w-24 rounded-lg"
          />
        ))}
      </div>

      {/* Resend Link */}
      <Skeleton className="h-5 w-40 mt-4" />

      {/* Verify Button */}
      <Skeleton className="h-12 w-52 mt-6 rounded-lg" />
    </div>
  );
};

// Forget Password Skeleton
export const ForgetPasswordSkeleton = () => {
  return (
    <div className="flex bg-background flex-col items-center justify-center h-screen w-full">
      {/* Icon */}
      <Skeleton className="w-20 h-20 sm:w-32 sm:h-32 rounded-lg mb-12" />

      {/* Title */}
      <Skeleton className="h-8 w-64 mb-3" />

      {/* Subtitle */}
      <Skeleton className="h-5 w-80 mb-3" />

      {/* Email Input */}
      <Skeleton className="h-14 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-lg" />

      {/* Continue Button */}
      <Skeleton className="h-12 w-40 mt-4 rounded-lg" />
    </div>
  );
};

// Reset Password Skeleton
export const ResetPasswordSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
      {/* Title */}
      <Skeleton className="h-8 w-56 mb-3" />

      {/* Subtitle */}
      <Skeleton className="h-5 w-80 mb-3" />

      {/* OTP Input */}
      <Skeleton className="h-14 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-lg mb-3" />

      {/* Password Input */}
      <Skeleton className="h-14 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-lg mb-3" />

      {/* Confirm Password Input */}
      <Skeleton className="h-14 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-lg" />

      {/* Buttons */}
      <div className="flex space-x-4 items-center mt-6">
        <Skeleton className="h-12 w-40 rounded-lg" />
        <Skeleton className="h-12 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
