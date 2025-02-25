import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import AddRewardModal from "../AddRewardModal/AddRewardModal";
import EditRewardModal from "../EditRewardModal/EditRewardModal"; // Import the Edit Modal
import EditIcon from "@mui/icons-material/Edit";

const RewardTable = () => {
  const [rewards, setRewards] = useState([
    {
      config_id: 1,
      points_per_rupee: 10,
      usage_limit: "5 times per user",
      from_whom: "Service Provider",
      who_uses: "Customers",
      rewards_sent_by_partner: "Yes",
    },
    {
      config_id: 2,
      points_per_rupee: 15,
      usage_limit: "Unlimited",
      from_whom: "Admin",
      who_uses: "All Users",
      rewards_sent_by_partner: "No",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false);
  const [isEditRewardModalOpen, setIsEditRewardModalOpen] = useState(false); // Track Edit Modal state
  const [selectedReward, setSelectedReward] = useState(null); // Track reward to edit
  const entriesPerPage = 10;

  const normalizeString = (str) =>
    str?.replace(/\s+/g, " ").trim().toLowerCase() || "";

  const filteredData = rewards.filter((item) => {
    const searchTerm = normalizeString(searchQuery);

    return (
      normalizeString(item.points_per_rupee.toString()).includes(searchTerm) ||
      normalizeString(item.usage_limit).includes(searchTerm) ||
      normalizeString(item.from_whom).includes(searchTerm) ||
      normalizeString(item.who_uses).includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  // Handle Add Reward
  const handleAddReward = (newReward) => {
    setRewards((prevRewards) => [
      ...prevRewards,
      { ...newReward, config_id: prevRewards.length + 1 },
    ]);
    toast.success("Reward added successfully!");
  };

  // Handle Edit Click
  const handleEditClick = (reward) => {
    setSelectedReward(reward);
    setIsEditRewardModalOpen(true);
  };

  return (
    <div className="Restro-Table-Main p-3">
      <h2>Reward Points System</h2>
      <div
        className="mb-3"
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          className="Discount-btn mb-0"
          onClick={() => setIsAddRewardModalOpen(true)}
        >
          Add Rewards
        </button>

        <div className="search-bar " style={{ width: "350px" }}>
          <input
            type="text"
            placeholder="Search rewards"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-bordered table-user">
              <thead>
                <tr>
                  <th scope="col">Sr No.</th>
                  <th scope="col">1 Rs = Points</th>
                  <th scope="col">Usage Limit</th>
                  <th scope="col">From Whom Given</th>
                  <th scope="col">Who Uses Rewards</th>
                  <th scope="col">Reward Sent by Partner</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((reward, index) => (
                    <tr key={reward.config_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{reward.points_per_rupee || "N/A"}</td>
                      <td>{reward.usage_limit || "N/A"}</td>
                      <td>{reward.from_whom || "N/A"}</td>
                      <td>{reward.who_uses || "N/A"}</td>
                      <td>{reward.rewards_sent_by_partner || "N/A"}</td>
                      <td className="status-div">
                        <EditIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditClick(reward)}
                        />
                        <i className="fa fa-trash text-danger"
                           style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AddRewardModal
        open={isAddRewardModalOpen}
        onClose={() => setIsAddRewardModalOpen(false)}
        onSave={handleAddReward}
      />

      {/* Edit Reward Modal */}
      <EditRewardModal
        open={isEditRewardModalOpen}
        onClose={() => setIsEditRewardModalOpen(false)}
        reward={selectedReward}
      />
    </div>
  );
};

export default RewardTable;
