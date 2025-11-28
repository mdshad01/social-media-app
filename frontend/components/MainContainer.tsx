"use client";

import { usePathname } from "next/navigation";

export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noPadding = pathname.startsWith("/settings");

  const className = noPadding
    ? "bg-[#F4F2F2] h-[90vh] lg:h-[92vh]" // no padding
    : "bg-[#F4F2F2] sm:px-0 md:px-8 lg:px-16 xl:px-28 2xl:px-64 h-[90vh] lg:h-[90vh]";

  return <div className={className}>{children}</div>;
}
