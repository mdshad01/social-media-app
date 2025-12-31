"use client";
import React, { useState, useRef, useEffect } from "react";
import { RootState } from "@/store/store";
import {
  Bell,
  ChevronDown,
  Palette,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const tabs = [
  {
    value: "account",
    label: "Account",
    icon: <User size={24} />,
    href: "/settings/account",
  },
  {
    value: "appearance",
    label: "Appearance",
    icon: <Palette size={24} />,
    href: "/settings/appearance",
  },
  {
    value: "privacy",
    label: "Privacy",
    icon: <ShieldAlert size={24} />,
    href: "/settings/privacy",
  },
  {
    value: "security",
    label: "Security",
    icon: <ShieldCheck size={24} />,
    href: "/settings/security",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: <Bell size={24} />,
    href: "/settings/notifications",
  },
];

const TabNavigation = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
 const dropdownRef = useRef<HTMLLIElement>(null);

  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;

      if (width >= 1080) {
        // xl: Show all 5 tabs (no More button)
        setVisibleCount(5);
      } else if (width >= 658) {
        // lg: Show 4 tabs + More
        setVisibleCount(4);
      } else if (width >= 540) {
        // md: Show 3 tabs + More
        setVisibleCount(3);
      } else {
        // sm: Show 2 tabs + More
        setVisibleCount(2);
      }
    };

    // Initial check
    updateVisibleCount();

    // Listen for window resize
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  // First 2 tabs to show directly
  const visibleTabs = tabs.slice(0, visibleCount);
  // Remaining tabs in "More" dropdown
  const moreTabs = tabs.slice(visibleCount);

  // Check if any "more" tab is active
  const isMoreActive = moreTabs.some((tab) => pathname.startsWith(tab.href));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoreDropdown(false);
      }
    };

    if (showMoreDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreDropdown]);

  return (
    <div className="bg-card">
      <div className="flex p-4 gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt="Profile"
          height={40}
          width={40}
          className="rounded-full w-10 h-10"
        />
        <h2 className="text-3xl text-foreground font-semibold">Settings</h2>
      </div>
      <ul className="py-0 pl-0 bg-card text-secondary-foreground flex gap-1 text-sm">
        {/* Visible Tabs (Account, Privacy) */}
        {visibleTabs.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={index}>
              <li
                className={`flex items-center gap-1 p-2 py-4 rounded hover:bg-accent cursor-pointer ${
                  isActive
                    ? "text-chart-1 border-b-4 border-chart-1"
                    : "border-transparent border-l-4"
                }`}
              >
                <span className="flex gap-1 ">
                  {item.icon}
                  <span className="font-medium text-xl text-inherit">
                    {item.label}
                  </span>
                </span>
              </li>
            </Link>
          );
        })}

        {/* More Dropdown */}
        <li className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowMoreDropdown(!showMoreDropdown)}
            className={`flex items-center gap-4 p-2 py-4 rounded hover:bg-accent cursor-pointer ${
              isMoreActive
                ? "text-chart-1 border-b-4 border-chart-1"
                : "border-transparent border-l-4"
            }`}
          >
            <span className="flex gap-1 pl-4 items-center">
              <span className="font-medium text-xl text-inherit">More</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  showMoreDropdown ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {/* Dropdown Menu */}
          {showMoreDropdown && (
            <div className="absolute top-full mt-2 -left-12 w-44 bg-card border border-border rounded-lg shadow-lg px-1 py-2 z-50">
              {moreTabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                return (
                  <Link key={tab.value} href={tab.href}>
                    <button
                      onClick={() => setShowMoreDropdown(false)}
                      className={`w-full flex items-center gap-3 pl-3 py-3 transition-colors ${
                        isActive
                          ? "bg-primary/10 dark:bg-primary/20 text-primary"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium text-lg">{tab.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default TabNavigation;
