import {
  BarChart,
  People,
  Settings,
  AttachMoney,
  CalendarToday,
  Category,
  Help,
  Image,
  Info,
  LocalOffer,
  PriceChange,
  Work,
  Home,
  Person,
  StarHalf,
  GridView,
  QuestionAnswer,
  AccountBox,
} from "@mui/icons-material";
import { Gavel, Lock, ReceiptLong, Cancel } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import "./Sidebar.css";

// Custom styled tooltip
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: "0.9rem",
    boxShadow: theme.shadows[1],
    borderRadius: "4px",
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.common.black,
  },
}));

const Sidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState("");
  const [permissions, setPermissions] = useState([]);
  const location = useLocation();
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

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
          const sortedPermissions = data.data.sort(
            (a, b) => a.index_id - b.index_id
          );
          setPermissions(sortedPermissions);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [token]);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  const iconMapping = {
    1: <Home />,
    2: <AttachMoney />,
    3: <Person />,
    4: <QuestionAnswer />,
    5: <StarHalf />,
    6: <GridView />,
    7: <Category />,
    8: <AttachMoney />,
    9: <PriceChange />,
    10: <LocalOffer />,
    11: <CalendarToday />,
    12: <Settings />,
    13: <AccountBox />,
    14: <People />,
    15: <BarChart />,
    16: <Image />,
    17: <Work />,
    18: <Help />,
    19: <Info />,
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-menu-container">
        <ul style={{ marginTop: "8vh" }} className="sidebar-menu">
          {permissions.map((permission) => {
            const { permission_id, permission_name, path } = permission;
            const itemPath =
              path || `/${permission_name.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <CustomTooltip
                key={permission_id}
                title={!isOpen ? permission_name : ""}
                placement="right"
                arrow
              >
                <Link to={itemPath}>
                  <li
                    className={`menu-item ${
                      activeItem === itemPath ? "active" : ""
                    }`}
                    onClick={() => handleItemClick(itemPath)}
                  >
                    {iconMapping[permission_id] || <Info />}
                    {isOpen && <span>{permission_name}</span>}
                  </li>
                </Link>
              </CustomTooltip>
            );
          })}

          {/* Static Tabs for Terms and Conditions, Privacy Policy, and Cancellation Policy */}
          {[
            {
              path: "/termsconditions",
              name: "Terms and Conditions",
              icon: <Gavel />,
            },
            { path: "/privacypolicy", name: "Privacy Policy", icon: <Lock /> },
            {
              path: "/refundpolicy",
              name: "Refund Policy",
              icon: <ReceiptLong />,
            },
            {
              path: "/cancellationplicy",
              name: "Cancellation Policy",
              icon: <Cancel />,
            },
          ].map((tab) => (
            <CustomTooltip
              key={tab.path}
              title={!isOpen ? tab.name : ""}
              placement="right"
              arrow
            >
              <Link to={tab.path}>
                <li
                  className={`menu-item ${
                    activeItem === tab.path ? "active" : ""
                  }`}
                  onClick={() => handleItemClick(tab.path)}
                >
                  {tab.icon}
                  {isOpen && <span>{tab.name}</span>}
                </li>
              </Link>
            </CustomTooltip>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
