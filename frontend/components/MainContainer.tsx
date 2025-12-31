"use client";

import { usePathname } from "next/navigation";

export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noPadding = pathname.startsWith("/settings");
  const noPadding1 = pathname.startsWith("/auth");

  const className = noPadding || noPadding1
    ? "bg-forground h-[90vh] lg:h-[92vh]" // no padding
    : "bg-forground sm:px-0 md:px-8 lg:px-16 xl:px-28 2xl:px-64 h-[90vh] lg:h-[90vh]";

  return <div className={className}>{children}</div>;
}
