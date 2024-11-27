import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineHome } from "react-icons/hi2";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";




const Sidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState(""); // State to track the active item
  const location = useLocation(); // Get the current location

  useEffect(() => {
    console.log("Component updated, current value:", isOpen);
  }, [isOpen]);

  // Set active item based on the current path
  useEffect(() => {
    setActiveItem(location.pathname); // Set the active item based on current path
  }, [location]);

  // Function to set the active item when clicked
  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-menu-container">
        {/* Sidebar Menu */}
        <ul style={{marginTop:"8vh"}} className="sidebar-menu">










        <Link to="/dashboard">
            <li
              className={`menu-item ${
                activeItem === "/dashboard" ? "active" : ""
              }`}
              onClick={() => handleItemClick("/dashboard")}
            >
              <HiOutlineHome />
              <span className="hover_clr">Dashboard</span>
            </li>
          </Link>



           <Link to="/partners">
          <li className={`menu-item ${activeItem === "/partners" ? "active" : ""}`} onClick={() => handleItemClick("/commission")}>
          <LiaMoneyBillWaveSolid />
              <span>Partners</span>
          </li>
          </Link> 


      

        </ul>

      </div>
    </div>
  );
};

export default Sidebar;
