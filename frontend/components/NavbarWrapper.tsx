// components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Home/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) return null;

  return <Navbar />;
}
