import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";

const ClientLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onSidebarToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <main className="flex-1 w-full min-w-0 p-2 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
