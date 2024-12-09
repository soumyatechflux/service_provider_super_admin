import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import { toast } from "react-toastify";
import EditStatusModal from "./../SupportCustomerTab/EditStatusModal/EditStatusModal";
import EditIcon from "@mui/icons-material/Edit";


const SupportPartnerTab = () => {
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
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/supports/?user_role=partner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      console.log("Partner Response ",response)

      if (response?.status===200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setSupportData(data);
      } else {
        toast.error(response.data.message || "Failed to fetch support tickets.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load support tickets. Please try again.");
      setLoading(false);
    }
  };

  const handleEditStatus = (support) => {
    setSelectedSupport(support); // Set the selected support ticket
    setShowModal(true); // Show the modal
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
                {/* <th scope="col" style={{ width: "5%" }}>Sr.</th> */}
                <th scope="col" style={{ width: "10%" }}>Support ID</th>
                <th scope="col" style={{ width: "15%" }}>Email</th>
                <th scope="col" style={{ width: "10%" }}>Role</th>
                <th scope="col" style={{ width: "15%" }}>Subject</th>
                <th scope="col" style={{ width: "20%" }}>Description</th>
                <th scope="col" style={{ width: "10%" }}>Status</th>
                <th scope="col" style={{ width: "10%" }}>Created At</th>
                <th scope="col" style={{ width: "10%" }}>Updated At</th>
              </tr>
            </thead>
            <tbody style={{ cursor: "default" }}>
              {supportData.map((item) => (
                <tr style={{ cursor: "default" }} key={item.support_id}>
                  {/* <th scope="row" className="id-user">{index + 1}.</th> */}
                  <td className="text-user">{item.support_id}</td>
                  <td className="text-user">{item.email}</td>
                  <td className="text-user">{item.user_role}</td>
                  <td className="text-user">{item.subject}</td>
                  <td className="text-user">{item.description}</td>
                  <td className="text-user">
                  <div className="status-div">
                  <span>{item.status === "open" ? "Open" : "Closed"}</span>
                      <EditIcon
                        onClick={() => handleEditStatus(item)} // Trigger modal
                      />
                    </div>
                  </td> 
                  <td className="text-user">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    //   hour: "2-digit",
                    //   minute: "2-digit",
                    }).format(new Date(item.created_at))}
                  </td>
                  <td className="text-user">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    //   hour: "2-digit",
                    //   minute: "2-digit",
                    }).format(new Date(item.updated_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <EditStatusModal
          support={selectedSupport}
          onClose={() => setShowModal(false)} // Close the modal
          onStatusChange={getSupportData} // Refresh data after status change
        />
      )}
    </div>
  );
};

export default SupportPartnerTab;
