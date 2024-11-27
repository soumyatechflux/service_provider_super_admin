import React, { useEffect, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import HeyMaria from "./HeyMariaSection/HeyMaria";
import AddMenuDashboard from "./AddMenuDashboard/AddMenuDashboard";
import GraphDashboard from "./GarphDashboard/GraphDashboard";

const Dashboard = () => {

  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage.getItem('isSidebarOpen');
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });

  // Effect to poll sessionStorage value repeatedly
  useEffect(() => {
    const checksessionStorage = () => {
      const storedValue = sessionStorage.getItem('isSidebarOpen');
      const parsedValue = storedValue !== null ? JSON.parse(storedValue) : true;
      
      if (parsedValue !== value) {
        setValue(parsedValue);
        console.log('sessionStorage value updated:', parsedValue); // Log the updated value
      }
    };

    // Polling interval in milliseconds (e.g., 10ms)
    const intervalId = setInterval(checksessionStorage, 10);

    // Cleanup function to clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }, [value]);

  useEffect(() => {
    console.log('Component updated, current value:', value);
  }, [value]);



  return (
    <>
      {console.log('After',value)}
       <div className={`content-container ${value ? 'sidebar-open' : 'sidebar-closed'}`}>
      
        <HeyMaria/>
        <AddMenuDashboard/>
        <GraphDashboard/>
    </div>
    </>
   
  );
};

export default Dashboard;
