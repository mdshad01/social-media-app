import Sidebar from "@/components/settings/Sidebar";
import SettingsNavbar from "@/components/settings/SettingsNavbar";
import TabNavigation from "@/components/settings/Content/util/TabNavigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-background">
      {/* Main Content with Sidebar */}
      <div className="flex flex-col md:flex-row">
        {/* ✅ Sidebar - No props needed! */}
        <div className="hidden bg-card md:block md:w-[30%] lg:w-[25%]">
          <Sidebar />
        </div>
        <div className="md:hidden flex-1 flex flex-col">
          <TabNavigation />
        </div>

        {/* Content Area */}
        <div className="w-full bg-background overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
