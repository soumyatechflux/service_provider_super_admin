import React, { useEffect, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import ReportingTabs from "./ReportingTabs/ReportingTabs";
import ReportingFilters from "./ReportingFilters/ReportingFilters";
import ReportTable from "./ReportingFilters/ReportTable/ReportTable";

const Reporting = () => {
  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage.getItem("isSidebarOpen");
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });

  // Effect to poll sessionStorage value repeatedly
  useEffect(() => {
    const checksessionStorage = () => {
      const storedValue = sessionStorage.getItem("isSidebarOpen");
      const parsedValue = storedValue !== null ? JSON.parse(storedValue) : true;

      if (parsedValue !== value) {
        setValue(parsedValue);
        console.log("sessionStorage value updated:", parsedValue); // Log the updated value
      }
    };

    // Polling interval in milliseconds (e.g., 10ms)
    const intervalId = setInterval(checksessionStorage, 10);

    // Cleanup function to clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }, [value]);


  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSearch = (filterData) => {
    setFilters(filterData);
  };
  const handleClearFilters = () => {
    setFilters({}); // Reset the filters to an empty object
    setLoading(true); // Set loading to true to show the loader
  };

  return (
    <>
      <div
        className={`content-container ${
          value ? "sidebar-open" : "sidebar-closed"
        }`}
        style={{ marginTop: "30px" }}
      >
       {/* <ReportingTabs/> */}
       <ReportingFilters onSearch={handleSearch} onClear={handleClearFilters}/>
       <ReportTable filters={filters} loading={loading} setLoading={setLoading} />
      </div>
    </>
  );
};

export default Reporting;
