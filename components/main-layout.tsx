import React from "react";
import NavBar from "./nav-bar";
import SideBar from "./side-bar";
import BottomBar from "./bottom-bar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full w-full ">
        <NavBar />
        <SideBar>{children}</SideBar>
        <BottomBar />
      </div>
    </div>
  );
};

export default MainLayout;
