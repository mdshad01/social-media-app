"use client";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`skeleton rounded ${className}`} />;
};

// Settings Sidebar Skeleton
export const SettingsSidebarSkeleton = () => {
  return (
    <div className="p-4 space-y-2">
      <Skeleton className="h-6 w-32 mb-6" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
};

// Settings Content Skeleton
export const SettingsContentSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-32 mt-8 rounded-lg" />
    </div>
  );
};

// Account Settings Skeleton
export const AccountSettingsSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      {/* Profile Picture */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-12 mb-2" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-10 w-32 mt-8 rounded-lg" />
    </div>
  );
};

// Security Settings Skeleton
export const SecuritySettingsSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Privacy Settings Skeleton
export const PrivacySettingsSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Appearance Settings Skeleton
export const AppearanceSettingsSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="space-y-6">
        <div>
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-24 h-24 rounded-lg" />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-5 w-28 mb-4" />
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Settings Skeleton
export const NotificationsSettingsSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsContentSkeleton;
