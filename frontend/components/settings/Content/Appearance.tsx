import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Appearance = () => {
  return (
    <div className="w-full h-full bg-background flex flex-col items-center p-4">
      <div className="w-[64%] bg-card rounded-md shadow-sm border border-border">
        <div className="p-4">
          <h2 className="text-[20px] font-medium text-foreground">Display</h2>
        </div>
        <div className="px-4 pb-3">
          <div className="w-full items-center">
            <Link
              href="/settings/appearance/display"
              className="text-muted-foreground hover:text-foreground flex justify-between w-full transition-colors"
            >
              Dark mode{" "}
              <span className="text-muted-foreground font-medium">
                <ArrowRight size={20} />
              </span>
            </Link>
          </div>
        </div>
        <div className="h-[1px] w-full bg-border"></div>
      </div>
    </div>
  );
};

export default Appearance;
