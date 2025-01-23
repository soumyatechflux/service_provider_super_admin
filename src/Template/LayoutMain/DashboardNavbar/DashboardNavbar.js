import React, { useState, useEffect, useRef } from "react";
import LogoutModal from "./LogoutModal/LogoutModal";
import "./DashboardNavbar.css";

const DashboardNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [notificationCount, setNotificationCount] = useState(0); // State to manage notification count
  const dropdownRef = useRef(null); // To detect clicks outside the dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Open modal when logout is clicked
  const handleLogoutClick = () => {
    setIsModalOpen(true); // Open the modal
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="leftside_navbar_dashboard">
        <div className="DineRightLogo_Dashboard">
        {!isSidebarOpen && (
              //   <span  style={{cursor:"default"}} className="navbar-brand font-serif">
              //   Servyo
              // </span>

              <img 
              src="/images/SP_Logo.png" 
              alt="Servyo Logo" 
              className="navbar-brand-logo" 
              style={{ height: "40px", cursor: "pointer" }}
            />
          )}

          {isSidebarOpen && (
              //    <span  style={{cursor:"default"}} className="navbar-brand font-serif">
              //    Servyo
              //  </span>
              <img 
              src="/images/SP_Logo.png" 
              alt="Servyo Logo" 
              className="navbar-brand-logo" 
              style={{ height: "40px", cursor: "pointer" }}
            />
          )}
        </div>
        <div className="Hamburger_Dashboard">
          {isSidebarOpen ? (
            <img
              className="Hamburger_MobileResponsive"
              src="./assets/images/Dashboard_Navbar/hamburger.png"
              alt="Hamburger Icon"
              onClick={toggleSidebar}
            />
          ) : (
            <img
              className="Hamburger_MobileResponsive"
              src="./assets/images/Dashboard_Navbar/arrow.png"
              alt="Arrow Icon"
              onClick={toggleSidebar}
            />
          )}
        </div>
      </div>
{/* 
      <div className="Centre_navbar_dashboard">
        <input
          className="Search_dashboard"
          type="text"
          placeholder="Search.."
        />
      </div> */}

      <div className="Rightside_navbar_dashboard">

        {/* <div className="notification-bell">
          <img
            src="./assets/images/Dashboard_Navbar/bell.png"
            alt="Bell Icon"
            className="notification-bell-img"
          />
          <span className="notification-count">{notificationCount}</span>{" "}
   
        </div> */}


        <div className="profile-dropdown" ref={dropdownRef}>
        <img
    src="./assets/images/Dashboard_Navbar/profile_nav.png"
    alt="Profile"
    // onClick={toggleDropdown}
    onClick={handleLogoutClick}
    className="profile-img"
    style={{ height: '40px', width: '40px' }} 
/>

          {isDropdownOpen && (
            <ul className="dropdown-menu">
              {/* <li>
                <a href="/profile">Profile</a>
              </li> */}
              <li>
                <a onClick={handleLogoutClick}>Logout</a>
              </li>{" "}
              {/* Open modal on logout */}
            </ul>
          )}
        </div>
      </div>

      {/* Render the LogoutModal and pass the props to control it */}
      <LogoutModal isOpen={isModalOpen} onClose={closeModal} />
    </nav>
  );
};

export default DashboardNavbar;
