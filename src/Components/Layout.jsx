import React from "react";
import Sidebar from "../Components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
