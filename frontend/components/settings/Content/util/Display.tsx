"use client";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const Display = () => {
  return (
    <div className="w-full h-full bg-background flex flex-col items-center p-4">
      <div className="w-[64%] bg-card rounded-md shadow-sm border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-[20px] font-medium text-foreground">Dark Mode</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your preferred theme
          </p>
        </div>

        <div className="p-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Display;
