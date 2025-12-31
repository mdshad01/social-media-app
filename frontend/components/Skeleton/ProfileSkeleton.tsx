"use client";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`skeleton rounded ${className}`} />;
};

// Profile Card Skeleton (Cover + Avatar)
export const ProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:px-0">
      <div className="relative md:h-60 h-44 w-full shadow">
        {/* Cover Image */}
        <Skeleton className="w-full h-full md:rounded-md rounded-none" />
        
        {/* Avatar - Centered */}
        <Skeleton className="w-34 h-34 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-accent z-10 shadow" />
      </div>
      
      {/* Profile Info Card */}
      <div className="px-10 w-full bg-card flex flex-col gap-5 items-center justify-center pb-4 md:rounded-lg shadow">
        {/* Name */}
        <Skeleton className="h-8 w-48 mt-16 mb-2" />
        
        {/* Stats */}
        <div className="flex gap-10 items-center justify-center">
          <div className="flex flex-col items-center">
            <Skeleton className="h-6 w-8 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-6 w-8 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-6 w-8 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

// User Info Card Skeleton
export const UserInfoCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// User Media Card Skeleton
export const UserMediaCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
      <Skeleton className="h-5 w-20 mb-4" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
};

// Post/Save Toggle Skeleton
export const PostSaveToggleSkeleton = () => {
  return (
    <div className="flex justify-center gap-4 py-4 border-b border-border mb-4">
      <Skeleton className="h-10 w-24 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  );
};

// Profile Feed Skeleton
export const ProfileFeedSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
};

// Full Profile Page Skeleton
export const FullProfileSkeleton = () => {
  return (
    <div className="flex pt-6 bg-background">
      {/* Left Menu */}
      <div className="lg:w-[20%] xl:w-[18%] hidden md:block h-full">
        <div className="flex flex-col gap-4 sticky top-20 px-4">
          <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-[70%] xl:w-[60%] bg-background">
        <div className="px-0 md:px-5 flex flex-col">
          <ProfileCardSkeleton />
          <div className="md:px-8 py-2">
            <PostSaveToggleSkeleton />
            <ProfileFeedSkeleton />
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:flex xl:flex-col gap-6 w-[22%]">
        <UserInfoCardSkeleton />
        <UserMediaCardSkeleton />
      </div>
    </div>
  );
};

export default FullProfileSkeleton;
