import Sidebar from "@/components/settings/Sidebar";
import SettingsNavbar from "@/components/settings/SettingsNavbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-background">
      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* ✅ Sidebar - No props needed! */}
        <div className="hidden bg-card md:block md:w-[30%] lg:w-[25%]">
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="w-full bg-background overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
