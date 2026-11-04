import { cn } from "@/lib/utils";
import React from "react";

const BottomBar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `w-full h-[72px] bg-black flex justify-between items-center`,
        className
      )}
    >
      BottomBar
    </div>
  );
};

export default BottomBar;
