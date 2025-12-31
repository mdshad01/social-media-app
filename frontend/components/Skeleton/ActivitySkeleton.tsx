"use client";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`skeleton rounded ${className}`} />;
};

// Activity Item Skeleton
export const ActivityItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="w-12 h-12 rounded-lg" />
    </div>
  );
};

// Activity Stats Skeleton
export const ActivityStatsSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4 mb-4">
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Type Tabs Skeleton
export const ActivityTypeSkeleton = () => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
      ))}
    </div>
  );
};

// Full Activity Page Skeleton
export const ActivitySkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6 md:px-2 sm:px-0">
        {/* Left Sidebar */}
        <div className="hidden md:block md:w-[30%] lg:w-[20%]">
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
        <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%] p-5 bg-card rounded-xl">
          <ActivityTypeSkeleton />
          {[1, 2, 3, 4, 5].map((i) => (
            <ActivityItemSkeleton key={i} />
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-[28%] mt-1 space-y-6">
          {/* Suggested Users */}
          <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
            <Skeleton className="h-5 w-32 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Ad */}
          <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="w-full h-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySkeleton;
