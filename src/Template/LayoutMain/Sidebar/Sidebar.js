import { BarChart, People, Settings } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import HelpIcon from "@mui/icons-material/Help";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import WorkIcon from "@mui/icons-material/Work";
import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaStarHalfAlt, FaThLarge, FaUser } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi2";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

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
          const sortedPermissions = data.data.sort((a, b) => a.index_id - b.index_id);
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
    1: <HiOutlineHome />,
    2: <LiaMoneyBillWaveSolid />,
    3: <FaUser />,
    4: <FaQuestionCircle />,
    5: <FaStarHalfAlt />,
    6: <FaThLarge />,
    7: <CategoryIcon />,
    8: <AttachMoneyIcon />,
    9: <PriceChangeIcon />,
    10: <LocalOfferIcon />,
    11: <CalendarTodayIcon />,
    12: <Settings />,
    13: <Settings />,
    14: <People />,
    15: <BarChart />,
    16: <ImageIcon />,
    17: <WorkIcon />,
    18: <HelpIcon />,
    19: <InfoIcon />,
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-menu-container">
        <ul style={{ marginTop: "8vh" }} className="sidebar-menu">
          {permissions.map((permission) => {
            const { permission_id, permission_name, path } = permission;
            const itemPath = path || `/${permission_name.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <Link key={permission_id} to={itemPath}>
                <li
                  className={`menu-item ${activeItem === itemPath ? "active" : ""}`}
                  onClick={() => handleItemClick(itemPath)}
                >
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