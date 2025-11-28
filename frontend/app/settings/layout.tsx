import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>
    <div className="w-full">
    {children}
    </div>
    </div>;
};

export default layout;
