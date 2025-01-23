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

  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSearch = (filterData) => {
    setFilters(filterData);
    setLoading(true); // Trigger a reload in the table
  };

  const handleClearFilters = () => {
    setFilters({}); // Reset filters
    setLoading(true); // Trigger a reload in the table
  };

  return (
    <div
      className={`content-container ${
        value ? "sidebar-open" : "sidebar-closed"
      }`}
      style={{ marginTop: "30px" }}
    >
      <ReportingFilters onSearch={handleSearch} onClear={handleClearFilters} />
      <ReportTable filters={filters} loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default Reporting;
