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
  Loyalty, // Import the Reward Points Icon
} from "@mui/icons-material";
import { Gavel, Lock, ReceiptLong, ContactMail, Notifications, CardGiftcard, GroupAdd, RequestQuote } from "@mui/icons-material";
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
    const path = location.pathname;
    if (path.startsWith("/sub-categories")) {
      setActiveItem("/sub-categories"); 
    } else {
      setActiveItem(path);
    }
  }, [location]);

  const handleItemClick = (path) => {
    if (path.startsWith("/sub-categories")) {
      setActiveItem("/sub-categories");
    } else {
      setActiveItem(path);
    }
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
    20: <Gavel />,
    21: <Lock />,
    22: <ReceiptLong />,
    23: <ContactMail  />,
    24: <Notifications />,
    // 25: <Loyalty />,
    26: <CardGiftcard  />,
    27: <GroupAdd />,
    28: <RequestQuote />, 
    31: <RequestQuote />, 
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-menu-container"
      
      style={{ 
        overflowY: 'auto',
        height: 'calc(100vh - 8vh)',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        }
      }}
      
      >
        <ul style={{ marginTop: "8vh" }} className="sidebar-menu">
          {permissions.map((permission) => {
            const { permission_id, permission_name, path } = permission;
            const predefinedRoutes = {
              "Weekly Payouts": "/commission-due", 
            };
            
            const itemPath = predefinedRoutes[permission_name] || 
              (path || `/${permission_name.toLowerCase().replace(/\s+/g, "-")}`);
            
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
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;



// import {
//   BarChart,
//   People,
//   Settings,
//   AttachMoney,
//   CalendarToday,
//   Category,
//   Help,
//   Image,
//   Info,
//   LocalOffer,
//   PriceChange,
//   Work,
//   Home,
//   Person,
//   StarHalf,
//   GridView,
//   QuestionAnswer,
//   AccountBox,
// } from "@mui/icons-material";
// import { MailOutline } from "@mui/icons-material";

// import { Gavel, Lock, ReceiptLong, ContactMail, Notifications, CardGiftcard, GroupAdd, RequestQuote } from "@mui/icons-material";
// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Tooltip from "@mui/material/Tooltip";
// import { styled } from "@mui/material/styles";
// import "./Sidebar.css";

// // Custom styled tooltip
// const CustomTooltip = styled(({ className, ...props }) => (
//   <Tooltip {...props} arrow classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .MuiTooltip-tooltip`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//     fontSize: "0.9rem",
//     boxShadow: theme.shadows[1],
//     borderRadius: "4px",
//   },
//   [`& .MuiTooltip-arrow`]: {
//     color: theme.palette.common.black,
//   },
// }));

// const Sidebar = ({ isOpen }) => {
//   const [activeItem, setActiveItem] = useState("");
//   const [permissions, setPermissions] = useState([]);
//   const location = useLocation();
//   const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

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
//           const sortedPermissions = data.data.sort(
//             (a, b) => a.index_id - b.index_id
//           );
//           setPermissions(sortedPermissions);
//         }
//       } catch (error) {
//         console.error("Error fetching permissions:", error);
//       }
//     };

//     fetchPermissions();
//   }, [token]);

//   useEffect(() => {
//     const path = location.pathname;
//     if (path.startsWith("/sub-categories")) {
//       setActiveItem("/sub-categories"); 
//     } else {
//       setActiveItem(path);
//     }
//   }, [location]);

//   const handleItemClick = (path) => {
//     if (path.startsWith("/sub-categories")) {
//       setActiveItem("/sub-categories");
//     } else {
//       setActiveItem(path);
//     }
//   };

//   const iconMapping = {
//     1: <Home />,
//     2: <AttachMoney />,
//     3: <Person />,
//     4: <QuestionAnswer />,
//     5: <StarHalf />,
//     6: <GridView />,
//     7: <Category />,
//     8: <AttachMoney />,
//     9: <PriceChange />,
//     10: <LocalOffer />,
//     11: <CalendarToday />,
//     12: <Settings />,
//     13: <AccountBox />,
//     14: <People />,
//     15: <BarChart />,
//     16: <Image />,
//     17: <Work />,
//     18: <Help />,
//     19: <Info />,
//     20: <Gavel />,
//     21: <Lock />,
//     22: <ReceiptLong />,
//     23: <ContactMail  />,
//     24: <Notifications />,
//     // 25: <Loyalty />,
//     26: <CardGiftcard  />,
//     27: <GroupAdd />,
//     28: <RequestQuote />, 
//     31: <RequestQuote />, 
//   };

//   return (
//     <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
//       <div className="sidebar-menu-container"
      
//       style={{ 
//         overflowY: 'auto',
//         height: 'calc(100vh - 8vh)',
//         scrollbarWidth: 'thin',
//         '&::-webkit-scrollbar': {
//           width: '6px',
//         },
//         '&::-webkit-scrollbar-track': {
//           background: '#f1f1f1',
//         },
//         '&::-webkit-scrollbar-thumb': {
//           background: '#888',
//           borderRadius: '3px',
//         },
//         '&::-webkit-scrollbar-thumb:hover': {
//           background: '#555',
//         }
//       }}
      
//       >
//         <ul style={{ marginTop: "8vh" }} className="sidebar-menu">
//           {permissions.map((permission) => {
//             const { permission_id, permission_name, path } = permission;
//             const predefinedRoutes = {
//               "Weekly Payouts": "/commission-due", 
//             };
            
//             const itemPath = predefinedRoutes[permission_name] || 
//               (path || `/${permission_name.toLowerCase().replace(/\s+/g, "-")}`);
            
//             return (
//               <CustomTooltip
//                 key={permission_id}
//                 title={!isOpen ? permission_name : ""}
//                 placement="right"
//                 arrow
//               >
//                 <Link to={itemPath}>
//                   <li
//                     className={`menu-item ${
//                       activeItem === itemPath ? "active" : ""
//                     }`}
//                     onClick={() => handleItemClick(itemPath)}
//                   >
//                     {iconMapping[permission_id] || <Info />}
//                     {isOpen && <span>{permission_name}</span>}
//                   </li>
//                 </Link>
//               </CustomTooltip>
//             );
//           })}

// <Link to="/newsletter">
//   <li className={`menu-item ${activeItem === "/newsletter" ? "active" : ""}`} onClick={() => handleItemClick("/newsletter")}>
//     <MailOutline /> {/* You can replace this with an appropriate icon */}
//     {isOpen && <span>Newsletter</span>}
//   </li>
// </Link>

//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
