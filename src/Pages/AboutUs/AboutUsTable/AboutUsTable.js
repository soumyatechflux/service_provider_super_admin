import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import EditAboutUsModal from "../EditAboutUsModal/EditAboutUsModal";

const AboutUsTable = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false); // To manage modal visibility
  

  const fetchAboutUsData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/about_us`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        setAboutUsData(response.data.data);
      } else {
        toast.error(
          response?.data?.message || "Failed to fetch About Us data."
        );
      }
    } catch (error) {
      toast.error("Failed to load About Us data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUsData();
  }, []);

   // Open the modal
   const handleEditClick = () => {
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle submitting the updated data
  const handleSubmitChanges = () => {
    // You may want to refetch the data after the update
    handleCloseModal();
  };

  return (
    <div className="about-us-table-container" style={{ padding: "1rem" }}>
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{
            overflowX: "auto",
            marginBottom: "1rem",
            // border: "1px solid #ddd",
            padding: "1rem",
          }}
        >
          <button
            className="Discount-btn mb-3"
            onClick={handleEditClick}
          >
            Edit About Us Data
          </button>
          <table
            className="table table-bordered table-user"
            // style={{ minWidth: "800px" }}
          >
            
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th scope="col" style={{ width: "20%" }}>
                  Field
                </th>
                <th scope="col" style={{ width: "80%" }}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {aboutUsData && (
                <>
                  <tr>
                    <td>Title</td>
                    <td>{aboutUsData.title}</td>
                  </tr>
                  <tr>
                    <td>Sub Title</td>
                    <td>{aboutUsData.sub_title}</td>
                  </tr>
                  <tr>
                    <td>Description 1</td>
                    <td>{aboutUsData.description1}</td>
                  </tr>
                  <tr>
                    <td>Description 2</td>
                    <td>{aboutUsData.description2}</td>
                  </tr>
                  <tr>
                    <td>Our Mission</td>
                    <td>{aboutUsData.our_mission_description}</td>
                  </tr>
                  <tr>
                    <td>People Served</td>
                    <td>{aboutUsData.counter1}</td>
                  </tr>
                  <tr>
                    <td>Trained Professionals</td>
                    <td>{aboutUsData.counter2}</td>
                  </tr>
                  <tr>
                    <td>Cities</td>
                    <td>{aboutUsData.counter3}</td>
                  </tr>
                  <tr>
                    <td>Image 1</td>
                    <td>
                      <img
                        src={aboutUsData.image1}
                        alt="Image 1"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Image 2</td>
                    <td>
                      <img
                        src={aboutUsData.image2}
                        alt="Image 2"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Image 3</td>
                    <td>
                      <img
                        src={aboutUsData.image3}
                        alt="Image 3"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Image 4</td>
                    <td>
                      <img
                        src={aboutUsData.image4}
                        alt="Image 4"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pass data and handlers to the EditAboutUsModal */}
      <EditAboutUsModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitChanges}
        initialData={aboutUsData}
        fetchAboutUsData = {fetchAboutUsData}
      />
    </div>
  );
};

export default AboutUsTable;
