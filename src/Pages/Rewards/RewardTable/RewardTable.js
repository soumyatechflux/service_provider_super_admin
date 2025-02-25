import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";

const RewardTable = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const getSettingsTableData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      if (response?.data?.success) {
        setSettings(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch settings.");
      }
    } catch (error) {
      console.error("Error fetching settings data:", error);
      toast.error("Failed to load settings. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettingsTableData();
  }, []);

  const normalizeString = (str) => str?.replace(/\s+/g, " ").trim().toLowerCase() || "";

  const filteredData = settings.filter((item) => {
    const searchTerm = normalizeString(searchQuery);

    return (
      normalizeString(item.title).includes(searchTerm) ||
      normalizeString(item.config_key).includes(searchTerm) ||
      normalizeString(item.config_value).includes(searchTerm) ||
      normalizeString(item.description).includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Restro-Table-Main p-3">
      <h2>Reward Points System</h2>
      <div className="search-bar mb-3" style={{ width: "350px" }}>
        <input
          type="text"
          placeholder="Search settings"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-bordered table-user">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "10%" }}>Sr No.</th>
                  <th scope="col" style={{ width: "15%" }}>1 Rs = Points</th>
                  <th scope="col" style={{ width: "15%" }}>Usage Limit</th>
                  <th scope="col" style={{ width: "20%" }}>From Whom Given</th>
                  <th scope="col" style={{ width: "20%" }}>Who Uses Rewards</th>
                  <th scope="col" style={{ width: "20%" }}>Reward Sent by Partner</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((setting, index) => (
                    <tr key={setting.config_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{setting.points_per_rupee || "N/A"}</td>
                      <td>{setting.usage_limit || "N/A"}</td>
                      <td>{setting.from_whom || "N/A"}</td>
                      <td>{setting.who_uses || "N/A"}</td>
                      <td>{setting.rewards_sent_by_partner || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="d-flex justify-content-center">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
              </li>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default RewardTable;
