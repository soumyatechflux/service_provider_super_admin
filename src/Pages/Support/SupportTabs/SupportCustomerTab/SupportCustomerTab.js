import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import { toast } from "react-toastify";
import EditStatusModal from "./../SupportCustomerTab/EditStatusModal/EditStatusModal";
import EditIcon from "@mui/icons-material/Edit";

const SupportCustomerTab = () => {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null); // To store the selected ticket for status update
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const getSupportData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/supports/?user_role=customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setSupportData(data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch support tickets."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load support tickets. Please try again.");
      setLoading(false);
    }
  };

  const onStatusChange = (newStatus) => {
    // Update the status locally in the support data
    updateSupportStatus(selectedSupport.support_id, newStatus);
  
    // Call getSupportData to refresh the data after the successful status update
    getSupportData();
  };
  
  const handleEditStatus = (support) => {
    setSelectedSupport(support); // Set the selected support ticket
    setShowModal(true); // Show the modal
  };

  const updateSupportStatus = (supportId, newStatus) => {
    setSupportData((prevData) =>
      prevData.map((item) =>
        item.support_id === supportId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Fetch data on component mount
  useEffect(() => {
    getSupportData();
  }, []);

  return (
    <div className="Support-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table
            style={{ cursor: "default" }}
            className="table table-bordered table-user"
          >
            <thead style={{ cursor: "default" }} className="heading_user">
              <tr style={{ cursor: "default" }}>
                <th scope="col" style={{ width: "5%" }}>
                  ID
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Email
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Role
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Subject
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Description
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Created At
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody style={{ cursor: "default" }}>
              {supportData.map((item) => (
                <tr style={{ cursor: "default" }} key={item.support_id}>
                  <td className="text-user">{item.support_id}</td>
                  <td className="text-user">{item.email}</td>
                  <td className="text-user">{item.user_role}</td>
                  <td className="text-user">{item.subject}</td>
                  <td className="text-user">{item.description}</td>
                  <td className="text-user">
                    <div className="status-div">
                      <span>
                        {item.status === "open" && "Open"}
                        {item.status === "in-progress" && "In Progress"}
                        {item.status === "resolved" && "Resolved"}
                        {item.status === "closed" && "Closed"}
                      </span>
                      <EditIcon
                        onClick={() => handleEditStatus(item)} // Trigger modal
                        style={{cursor:"pointer"}}
                      />
                    </div>
                  </td>
                  <td className="text-user">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    }).format(new Date(item.created_at))}
                  </td>
                  <td className="text-user">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    }).format(new Date(item.updated_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* {showModal && (
        <EditStatusModal
          support={selectedSupport}
          onClose={() => setShowModal(false)} // Close the modal
          onStatusChange={(newStatus) =>
            updateSupportStatus(selectedSupport.support_id, newStatus)
          }
        />
      )} */}
      {showModal && (
  <EditStatusModal
    support={selectedSupport}
    onClose={() => setShowModal(false)} // Close the modal
    onStatusChange={onStatusChange} // Pass the updated handler to trigger status update and re-fetch
  />
)}

    </div>
  );
};

export default SupportCustomerTab;
