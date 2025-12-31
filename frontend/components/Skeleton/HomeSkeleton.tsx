"use client";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`skeleton rounded ${className}`} />;
};

// Navbar Skeleton
export const NavbarSkeleton = () => {
  return (
    <nav className="flex lg:h-[10vh] md:px-3 px-2 pt-3 md:pt-0 items-center w-full h-full bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 md:w-[20%] justify-start md:justify-center">
        <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
        <Skeleton className="hidden sm:block h-7 w-32 rounded" />
      </div>

      {/* Search box */}
      <div className="flex-1 md:w-1/2 mx-2 sm:mx-4">
        <Skeleton className="w-full h-9 sm:h-10 rounded-full" />
      </div>

      {/* Nav icons */}
      <div className="flex gap-2 sm:gap-4 md:gap-6 items-center md:w-[30%] justify-end">
        <Skeleton className="hidden md:block w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
        <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full" />
        <Skeleton className="hidden md:block w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full" />
        <Skeleton className="md:hidden w-8 h-8 rounded" />
      </div>
    </nav>
  );
};

// Left Menu Skeleton
export const LeftMenuSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sticky top-20">
      {/* Profile Card */}
      <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
        <div className="flex flex-col items-center">
          <Skeleton className="w-16 h-16 rounded-full mb-3" />
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="flex gap-4 w-full justify-center">
            <div className="text-center">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="text-center">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="text-center">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Add Post Skeleton
export const AddPostSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4 mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
};

// Post Card Skeleton
export const PostCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 py-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="w-6 h-6 rounded" />
      </div>

      {/* Caption */}
      <div className="px-4 mb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Image */}
      <Skeleton className="w-full h-80 rounded-none" />

      {/* Actions */}
      <div className="flex items-center justify-between px-4 mt-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>
    </div>
  );
};

// Feed Skeleton
export const FeedSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Right Sidebar Skeleton
export const RightSidebarSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sticky top-20">
      {/* Suggested Users */}
      <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Friend Requests */}
      <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
        <Skeleton className="h-5 w-36 mb-4" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Ad */}
      <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="w-full h-40 rounded-lg" />
      </div>
    </div>
  );
};

// Full Home Page Skeleton (with Navbar)
export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <NavbarSkeleton />
      
      {/* Main Content */}
      <div className="sm:px-0 md:px-8 lg:px-16 xl:px-28 2xl:px-64">
        <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6 md:px-2 sm:px-4">
          {/* Left Sidebar */}
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <LeftMenuSkeleton />
          </div>

          {/* Feed */}
          <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%]">
            <div className="flex flex-col gap-0">
              <AddPostSkeleton />
              <FeedSkeleton count={3} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:w-[28%]">
            <RightSidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
