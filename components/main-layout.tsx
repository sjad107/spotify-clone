import React from "react";
import AppProviders from "./app-providers";
import NavBar from "./nav-bar";
import SideBar from "./side-bar";
import BottomBar from "./bottom-bar";
import MobileNav from "./mobile-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AppProviders>
      <div className="flex h-full w-full flex-col">
        <NavBar />
        <SideBar className="min-h-0 flex-1">{children}</SideBar>
        <BottomBar />
        <MobileNav />
      </div>
    </AppProviders>
  );
};

export default MainLayout;
