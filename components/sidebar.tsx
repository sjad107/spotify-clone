import React from "react";
interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  return <div>{children}</div>;
};

export default Sidebar;
