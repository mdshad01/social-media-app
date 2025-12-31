"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) => {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Card Skeleton - for post cards, profile cards etc.
export const CardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1">
          <Skeleton variant="text" className="h-4 w-32 mb-2" />
          <Skeleton variant="text" className="h-3 w-20" />
        </div>
        <Skeleton variant="rounded" className="w-6 h-6" />
      </div>

      {/* Content */}
      <Skeleton variant="text" className="h-4 w-full mb-2" />
      <Skeleton variant="text" className="h-4 w-3/4 mb-4" />

      {/* Image */}
      <Skeleton variant="rounded" className="w-full h-64 mb-4" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Skeleton variant="rounded" className="h-8 w-20" />
          <Skeleton variant="rounded" className="h-8 w-24" />
        </div>
        <Skeleton variant="rounded" className="h-8 w-16" />
      </div>
    </div>
  );
};

// Post Feed Skeleton
export const PostFeedSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-6">
      {/* Cover */}
      <Skeleton variant="rounded" className="w-full h-32 mb-4" />

      {/* Avatar */}
      <div className="flex flex-col items-center -mt-16">
        <Skeleton variant="circular" className="w-24 h-24 border-4 border-card" />
        <Skeleton variant="text" className="h-6 w-32 mt-3" />
        <Skeleton variant="text" className="h-4 w-48 mt-2" />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mt-4">
        <div className="text-center">
          <Skeleton variant="text" className="h-5 w-8 mx-auto" />
          <Skeleton variant="text" className="h-4 w-12 mt-1" />
        </div>
        <div className="text-center">
          <Skeleton variant="text" className="h-5 w-8 mx-auto" />
          <Skeleton variant="text" className="h-4 w-16 mt-1" />
        </div>
        <div className="text-center">
          <Skeleton variant="text" className="h-5 w-8 mx-auto" />
          <Skeleton variant="text" className="h-4 w-16 mt-1" />
        </div>
      </div>

      {/* Button */}
      <Skeleton variant="rounded" className="h-10 w-full mt-4" />
    </div>
  );
};

// Sidebar Skeleton
export const SidebarSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
      <Skeleton variant="text" className="h-5 w-32 mb-4" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 mb-3">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1">
            <Skeleton variant="text" className="h-4 w-24 mb-1" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Comment Skeleton
export const CommentSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1">
            <Skeleton variant="text" className="h-4 w-24 mb-2" />
            <Skeleton variant="text" className="h-3 w-full mb-1" />
            <Skeleton variant="text" className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Navbar Skeleton
export const NavbarSkeleton = () => {
  return (
    <div className="h-16 bg-card border-b border-border px-4 flex items-center justify-between">
      <Skeleton variant="rounded" className="h-8 w-32" />
      <Skeleton variant="rounded" className="h-10 w-64" />
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton variant="circular" className="w-10 h-10" />
      </div>
    </div>
  );
};

// Full Page Loading Skeleton
export const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavbarSkeleton />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <ProfileSkeleton />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <PostFeedSkeleton count={3} />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <SidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
