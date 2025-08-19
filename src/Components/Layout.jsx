import React from "react";
import Sidebar from "../Components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#070a29] pl-6 pt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
