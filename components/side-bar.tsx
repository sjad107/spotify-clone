"use client";

import { cn } from "@/lib/utils";
import Box from "./box";

interface SideBarProps {
  children: React.ReactNode;
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ children, className }) => {
  return (
    <div className={cn("flex h-full", className)}>
      <div className="hidden md:flex md:flex-col md:gap-y-2 md:bg-black md:h-full md:w-[300px] md:p-2">
        <Box className="h-full">
          <div>Your Library</div>
          <div className="flex flex-col gap-y-2 overflow-x-hidden overflow-y-auto h-full">
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
            <p>Library contents</p>
          </div>
        </Box>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default SideBar;
