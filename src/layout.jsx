import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarDemo } from "./components/SidebarComponent";

const Layout = () => {
  return (
    <div className="flex h-full">
      <SidebarDemo outlet={<Outlet />} />
    </div>
  );
};

export default Layout;
