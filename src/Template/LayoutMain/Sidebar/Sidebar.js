// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "./Sidebar.css";
// import { HiOutlineHome } from "react-icons/hi2";
// import { LiaMoneyBillWaveSolid } from "react-icons/lia";
// import { FaUser } from "react-icons/fa6";
// import { FaQuestionCircle, FaStarHalfAlt, FaThLarge } from "react-icons/fa";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import CategoryIcon from "@mui/icons-material/Category";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import PriceChangeIcon from "@mui/icons-material/PriceChange";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import { Settings } from "@mui/icons-material";
// import { Report } from "@mui/icons-material";

// const Sidebar = ({ isOpen }) => {
//   const [activeItem, setActiveItem] = useState(""); // State to track the active item
//   const [permissions, setPermissions] = useState([]); // State to store permissions
//   const location = useLocation(); // Get the current location
//   const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

//   // Fetch role permissions from the API
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/role_permissions`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setPermissions(data.data); // Store the permissions in state
//         }
//       } catch (error) {
//         console.error("Error fetching permissions:", error);
//       }
//     };

//     fetchPermissions();
//   }, [token]);

//   // Set active item based on the current path
//   useEffect(() => {
//     setActiveItem(location.pathname); // Set the active item based on current path
//   }, [location]);

//   // Function to set the active item when clicked
//   const handleItemClick = (path) => {
//     setActiveItem(path);
//   };

//   // Function to check if a permission exists for the given permission ID
//   const hasPermission = (permissionId) => {
//     return permissions.some(
//       (permission) => permission.permission_id === permissionId
//     );
//   };

//   return (
//     <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
//       <div className="sidebar-menu-container">
//         {/* Sidebar Menu */}
//         <ul style={{ marginTop: "8vh" }} className="sidebar-menu">
//           {hasPermission(1) && (
//             <Link to="/dashboard">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/dashboard" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/dashboard")}
//               >
//                 <HiOutlineHome />
//                 <span className="hover_clr">Dashboard</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(2) && (
//             <Link to="/partners">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/partners" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/partners")}
//               >
//                 <LiaMoneyBillWaveSolid />
//                 <span>Partners</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(3) && (
//             <Link to="/customers">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/customers" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/customers")}
//               >
//                 <FaUser />
//                 <span>Customers</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(4) && (
//             <Link to="/support">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/support" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/support")}
//               >
//                 <FaQuestionCircle />
//                 <span>Support</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(5) && (
//             <Link to="/reviews-and-ratings">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/reviews-and-ratings" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/reviews-and-ratings")}
//               >
//                 <FaStarHalfAlt />
//                 <span>Reviews & Ratings</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(6) && (
//             <Link to="/categories">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/categories" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/categories")}
//               >
//                 <FaThLarge />
//                 <span>Categories</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(7) && (
//             <Link to="/sub-categories">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/sub-categories" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/sub-categories")}
//               >
//                 <CategoryIcon />
//                 <span>Sub-Categories</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(8) && (
//             <Link to="/commission-due">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/commission-due" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/commission-due")}
//               >
//                 <AttachMoneyIcon />
//                 <span>Commission Due</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(9) && (
//             <Link to="/pricing">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/pricing" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/pricing")}
//               >
//                 <PriceChangeIcon />
//                 <span>Pricing Module</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(10) && (
//             <Link to="/discount">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/discount" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/discount")}
//               >
//                 <LocalOfferIcon />
//                 <span>Discount</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(11) && (
//             <Link to="/booking">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/booking" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/booking")}
//               >
//                 <CalendarTodayIcon />
//                 <span>Bookings</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(12) && (
//             <Link to="/settings">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/settings" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/settings")}
//               >
//                 <Settings />
//                 <span>Settings</span>
//               </li>
//             </Link>
//           )}

//           {/* Add Role link if it exists */}
//           {hasPermission(13) && (
//             <Link to="/role">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/role" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/role")}
//               >
//                 <CalendarTodayIcon />
//                 <span>Role</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(14) && (
//             <Link to="/reporting">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/reporting" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/reporting")}
//               >
//                 <CalendarTodayIcon />
//                 <span>Reporting</span>
//               </li>
//             </Link>
//           )}

//           {hasPermission(15) && (
//             <Link to="/staff">
//               <li
//                 className={`menu-item ${
//                   activeItem === "/staff" ? "active" : ""
//                 }`}
//                 onClick={() => handleItemClick("/staff")}
//               >
//                 <CalendarTodayIcon />
//                 <span>Staff</span>
//               </li>
//             </Link>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineHome } from "react-icons/hi2";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa6";
import { FaQuestionCircle, FaStarHalfAlt, FaThLarge } from "react-icons/fa";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Settings, People, BarChart } from "@mui/icons-material"; // Added icons for Staff and Reporting

const Sidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState(""); // State to track the active item
  const [permissions, setPermissions] = useState([]); // State to store permissions
  const location = useLocation(); // Get the current location
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  // Fetch role permissions from the API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/role_permissions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          // Sort the permissions based on index_id
          const sortedPermissions = data.data.sort(
            (a, b) => a.index_id - b.index_id
          );
          setPermissions(sortedPermissions); // Store the sorted permissions in state
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [token]);

  // Set active item based on the current path
  useEffect(() => {
    setActiveItem(location.pathname); // Set the active item based on current path
  }, [location]);

  // Function to set the active item when clicked
  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  // Function to check if a permission exists for the given permission ID
  const hasPermission = (permissionId) => {
    return permissions.some(
      (permission) => permission.permission_id === permissionId
    );
  };

  // Icon mapping for each permission_id
  const iconMapping = {
    1: <HiOutlineHome />, // Dashboard
    2: <LiaMoneyBillWaveSolid />, // Partners
    3: <FaUser />, // Customers
    4: <FaQuestionCircle />, // Support
    5: <FaStarHalfAlt />, // Reviews & Ratings
    6: <FaThLarge />, // Categories
    7: <CategoryIcon />, // Sub-Categories
    8: <AttachMoneyIcon />, // Commission Due
    9: <PriceChangeIcon />, // Pricing Module
    10: <LocalOfferIcon />, // Discount
    11: <CalendarTodayIcon />, // Bookings
    12: <Settings />, // Settings
    13: <Settings />, // Roles
    14: <People />, // Staff
    15: <BarChart />, // Reporting
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-menu-container">
        {/* Sidebar Menu */}
        <ul style={{ marginTop: "8vh" }} className="sidebar-menu">
          {permissions.map((permission) => {
            const { permission_id, permission_name } = permission;

            // Only render menu item if the user has this permission
            if (!hasPermission(permission_id)) return null;

            const path = `/${permission_name.toLowerCase().replace(/\s+/g, "-")}`;

            return (
              <Link key={permission_id} to={path}>
                <li
                  className={`menu-item ${
                    activeItem === path ? "active" : ""
                  }`}
                  onClick={() => handleItemClick(path)}
                >
                  {/* Render the icon based on the permission_id */}
                  {iconMapping[permission_id]}
                  <span>{permission_name}</span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
