"use client";
import { RootState } from "@/store/store";
import { Bell, Palette, ShieldAlert, ShieldCheck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const tabs = [
  {
    value: "account",
    label: "Account",
    icon: <User size={32} />,
    href: "/settings/account",
  },
  {
    value: "privacy",
    label: "Privacy",
    icon: <ShieldAlert size={32} />,
    href: "/settings/privacy",
  },
  {
    value: "security",
    label: "Security",
    icon: <ShieldCheck size={32} />,
    href: "/settings/security",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: <Bell size={32} />,
    href: "/settings/notifications",
  },
  {
    value: "appearance",
    label: "Appearance",
    icon: <Palette size={32} />,
    href: "/settings/appearance",
  },
];

const Sidebar = () => {
  // ✅ No props needed!
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname(); // ✅ Get current route

  return (
    <div className="flex flex-col gap-3 bg-white h-[92vh] border-r-[1px] border-black/10">
      <div className="flex mt-6 pl-7 gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt="Profile"
          height={40}
          width={40}
          className="rounded-full w-10 h-10"
        />
        <h2 className="text-3xl text-gray-900 font-semibold">Settings</h2>
      </div>
      <ul className="py-3 pl-0 bg-white text-gray-700 flex flex-col gap-3 text-sm">
        {tabs.map((item, index) => {
          // ✅ Check if current route matches this tab
          const isActive = pathname.startsWith(item.href);

          return (
            <Link href={item.href} key={index}>
              <li
                className={`flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100 cursor-pointer
                  ${
                    isActive
                      ? "text-blue-600 border-l-4 border-blue-500"
                      : "border-transparent border-l-4"
                  }`}
              >
                <span className="flex gap-4 pl-4">
                  {item.icon}
                  <span className="font-medium text-xl text-inherit">
                    {item.label}
                  </span>
                </span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
