import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineHome } from "react-icons/hi2";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa6";
import {  FaQuestionCircle, FaStarHalfAlt, FaThLarge } from "react-icons/fa";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';









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


          <Link to="/customers">
          <li className={`menu-item ${activeItem === "/customers" ? "active" : ""}`} onClick={() => handleItemClick("/customers")}>
          <FaUser />
              <span>Customers</span>
          </li>
          </Link>


          <Link to="/support">
          <li className={`menu-item ${activeItem === "/support" ? "active" : ""}`} onClick={() => handleItemClick("/support")}>
          <FaQuestionCircle />
              <span>Support</span>
          </li>
          </Link>



          <Link to="/reviews-and-ratings">
          <li className={`menu-item ${activeItem === "/reviews-and-ratings" ? "active" : ""}`} onClick={() => handleItemClick("/reviews-and-ratings")}>
          <FaStarHalfAlt />
              <span>Reviews & Ratings</span>
          </li>
          </Link>


          <Link to="/categories">
          <li className={`menu-item ${activeItem === "/categories" ? "active" : ""}`} onClick={() => handleItemClick("/categories")}>
          <FaThLarge />
              <span>Categories</span>
          </li>
          </Link>


          <Link to="/sub-categories">
          <li className={`menu-item ${activeItem === "/sub-categories" ? "active" : ""}`} onClick={() => handleItemClick("/sub-categories")}>
          <CategoryIcon/>
              <span>Sub-Categories</span>
          </li>
          </Link>


          <Link to="/commission-due">
          <li className={`menu-item ${activeItem === "/commission-due" ? "active" : ""}`} onClick={() => handleItemClick("/commission-due")}>
          <AttachMoneyIcon />
              <span>Commission Due</span>
          </li>
          </Link>


      
        </ul>

      </div>
    </div>
  );
};

export default Sidebar;
