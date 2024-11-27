import React, { useState, useEffect } from "react";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar"; // Renamed to PascalCase
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    // Check if sidebar state exists in sessionStorage, if not, default to true
    JSON.parse(sessionStorage.getItem('isSidebarOpen')) || true
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Use effect to store the sidebar status in sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('isSidebarOpen', isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`content-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} /> {/* PascalCase used */}
        <main className="main-content"> {/* Removed extra dot before class name */}
          <Outlet context={{ isSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
