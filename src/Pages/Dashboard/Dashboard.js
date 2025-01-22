import React, { useEffect, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import SalesGraph from "./SalesGraph/SalesGraph";
import CommissionGraph from "./CommissionGraph/CommissionGraph";
import ProfitLossGraph from "./ProfitLossGraph/ProfitLossGraph";
import BookingsGraph from "./BookingsGraph/BookingsGraph";
import BookingTable from "./BookingTable/BookingTable";


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
      <h2>Dashboard</h2>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6"><SalesGraph/></div>
          <div className="col-12 col-md-6"><CommissionGraph/></div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6"><ProfitLossGraph/></div>
          <div className="col-12 col-md-6"><BookingsGraph/></div>
        </div>
        <BookingTable/>
      </div>
      </div>

    </>
  );
};

export default Dashboard;
