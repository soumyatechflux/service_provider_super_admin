import React, { useEffect, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";


const Dashboard = () => {


  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage.getItem("isSidebarOpen");
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });

  useEffect(() => {
    const checksessionStorage = () => {
      const storedValue = sessionStorage.getItem("isSidebarOpen");
      const parsedValue = storedValue !== null ? JSON.parse(storedValue) : true;
      if (parsedValue !== value) {
        setValue(parsedValue);
      }
    };
    const intervalId = setInterval(checksessionStorage, 10);
    return () => clearInterval(intervalId);
  }, [value]);


  return (
    <>
      <div className={`content-container ${value ? "sidebar-open" : "sidebar-closed"}`}>
Dashboard
      </div>

    </>
  );
};

export default Dashboard;
