import Sidebar from "@/components/settings/Sidebar";
import SettingsNavbar from "@/components/settings/SettingsNavbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-[#F4F2F2]">
      {/* Settings Navbar */}
      <div className="w-full bg-white border-b-[1px] border-black/10 px-8">
        <SettingsNavbar />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* ✅ Sidebar - No props needed! */}
        <div className="hidden md:block md:w-[30%] lg:w-[25%]">
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="w-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
