import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./VerifyChef.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyChef = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { restaurant, id, isVerify } = location.state || {};
  const [partnerDetails, setPartnerDetails] = useState([]);
  const navigate = useNavigate();

  const [cookDetails, setCookDetails] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    whatsapp: "",
    aadhar: "",
    dob: "",
    address: "",
    permanentAddress: "",
    experience: "",
    category: "",
    subCategory: "",
    dateOfJoining: "",
    languages: "",
    drivingLicenseNumber: "",
    licenseExpiryDate: "",
    carType: "",
    cuisines: "",
    vegNonVeg: "",
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    bankDetails: null,
    drivingLicense: null,
    currentAddressProof: null,
  });

  const getVerifyDetails = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (response?.status === 200 && response?.data?.success === true) {
        const data = response?.data?.data || [];
        console.log("test => ", data?.name);
        setPartnerDetails(data);
        console.log("MINE", partnerDetails);
        // setRestaurants(data);
      } else {
        toast.error(response.data.message || "Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching partners data:", error);
      // toast.error("Failed to load partners data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getVerifyDetails();
  }, []);

  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    setCookDetails((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };
  
  const verificationHeadings = {
    1: "Cook Verification",
    2: "Driver Verification",
    3: "Gardener Verification",
  };
  const heading = verificationHeadings[restaurant] || "Default Verification";

  const verifyPartnerDetails = async () => {
    const requiredFields = [
      "dob",
      "email",
      "aadhar",
      "address",
      "permanentAddress",
      "experience",
      "subCategory",
      "dateOfJoining",
      "languages",
      "aadharFront",
      "aadharBack",
      "panCard",
      "bankDetails",
    ];
  
    // Validate that no required field is missing
    const missingFields = requiredFields.filter((field) => !cookDetails[field]);
  
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }
  
    // Check if driving license is required for restaurant 2
    if (restaurant === 2 && !cookDetails.drivingLicense) {
      toast.error("Please upload the Driving License Photocopy.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
  
      const formData = new FormData();
      formData.append("name", cookDetails.name);
      formData.append("email", cookDetails.email);
      formData.append("mobile", cookDetails.phone);
      formData.append("dob", cookDetails.dob);
      formData.append("aadhar", cookDetails.aadhar);
      formData.append("current_address", cookDetails.address);
      formData.append("permanent_address", cookDetails.permanentAddress);
      formData.append("years_of_experience", cookDetails.experience);
      formData.append("specialisation", cookDetails.subCategory);
      formData.append("date_of_joining", cookDetails.dateOfJoining);
      formData.append("languages", cookDetails.languages);
      formData.append(
        "driving_license_number",
        cookDetails.drivingLicenseNumber
      );
      formData.append(
        "driving_license_expiry_date",
        cookDetails.licenseExpiryDate
      );
      formData.append("car_type", cookDetails.carType);
      formData.append("aadhar_front", cookDetails.aadharFront);
      formData.append("aadhar_back", cookDetails.aadharBack);
      formData.append("pancard", cookDetails.panCard);
      formData.append("bank_passbook", cookDetails.bankDetails);
      formData.append("driving_licence", cookDetails.drivingLicense);
      formData.append("address_proof", cookDetails.currentAddressProof);
      formData.append("partner_id", id);
      formData.append("is_verify", isVerify);
  
      setLoading(true);
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/verify`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setLoading(false);
  
      if (response.status === 200 && response.data.success) {
        toast.success("Partner verified successfully!");
        navigate("/partners");
      } else {
        toast.error(response.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("Failed to verify partner. Please try again.");
      setLoading(false);
    }
  };
  

  return (
    <div className="verification-container">
      <h2>{heading}</h2>

      {/* Basic Fields */}

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <span>{partnerDetails?.name?.charAt(0).toUpperCase()}</span>
          </div>
        </div>

        <div className="details-section">
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={partnerDetails?.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />

          <label>Mobile Number</label>

          <input
            type="text"
            name="phone"
            value={partnerDetails?.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
          />

          <label>Email</label>

          <input
  type="text"
  name="email"
  value={cookDetails.email}
  onChange={handleInputChange}
  placeholder="Enter email"
/>

        </div>
      </div>

      {/* Additional Fields Based on ID */}

      {restaurant === 1 && (
        <>
          <label>Cuisines</label>

          <input
            type="text"
            name="cuisines"
            value={cookDetails?.cuisines}
            onChange={handleInputChange}
            placeholder="Enter cuisines"
            required
          />

          <label>Veg / Non-Veg</label>

          <select
            name="vegNonVeg"
            value={cookDetails?.vegNonVeg}
            onChange={handleInputChange}
          >
            <option value="">Select</option>

            <option value="Veg">Veg</option>

            <option value="Non-Veg">Non-Veg</option>
          </select>
        </>
      )}

      {restaurant === 2 && (
        <>
          <label>Driving License Number</label>

          <input
            type="text"
            name="drivingLicenseNumber"
            value={cookDetails?.drivingLicenseNumber}
            onChange={handleInputChange}
            placeholder="Enter driving license number"
            required
          />

          <label>License Expiry Date</label>

          <input
            type="date"
            name="licenseExpiryDate"
            value={cookDetails?.licenseExpiryDate}
            onChange={handleInputChange}
            required
          />

          <label>Car Type</label>

          <select
            name="carType"
            value={cookDetails?.carType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Car Type</option>

            <option value="automatic">Automatic</option>

            <option value="manual">Manual</option>
          </select>
        </>
      )}

      {/* Common Fields */}
      <label>Date of Birth</label>

      <input
        type="date"
        name="dob"
        value={cookDetails?.dob}
        onChange={handleInputChange}
        placeholder="Enter Date of Birth"
        required
      />

      <div className="additional-details mt-2">
        <label>Gender</label>

        <select
          name="gender"
          value={cookDetails?.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>

          <option value="Male">Male</option>

          <option value="Female">Female</option>

          <option value="Other">Other</option>
        </select>

        <label>Aadhar Card Number</label>

        <input
          type="text"
          name="aadhar"
          value={cookDetails?.aadhar}
          onChange={handleInputChange}
          placeholder="Enter Aadhar card number"
          required
        />

        <label>Current Address</label>

        <input
          type="text"
          name="address"
          value={cookDetails.address}
          onChange={handleInputChange}
          placeholder="Enter current address"
          required
        />

        <label>Permanent Address</label>

        <input
          type="text"
          name="permanentAddress"
          value={cookDetails.permanentAddress}
          onChange={handleInputChange}
          placeholder="Enter permanent address"
          required
        />

        <label>Years of Experience</label>

        <input
          type="number"
          name="experience"
          value={cookDetails?.experience}
          onChange={handleInputChange}
          placeholder="Enter years of experience"
          required
        />

        <label>Category</label>

        <input
          type="text"
          name="category"
          value={cookDetails?.category}
          onChange={handleInputChange}
          placeholder="Enter category"
          required
        />

        <label>Specialization / Sub Category</label>

        <input
          type="text"
          name="subCategory"
          value={cookDetails?.subCategory}
          onChange={handleInputChange}
          placeholder="Enter specialization / sub-category"
        />

        <label>Date of Joining</label>

        <input
          type="date"
          name="dateOfJoining"
          value={cookDetails?.dateOfJoining}
          onChange={handleInputChange}
          required
        />

        <label>Languages</label>

        <input
          type="text"
          name="languages"
          value={cookDetails?.languages}
          onChange={handleInputChange}
          placeholder="Enter languages (comma-separated)"
          required
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="document-section">
        <h2>Documents</h2>

        <div className="file-input-group">
          <label htmlFor="bankDetails">Bank Details Photocopy</label>

          <input
            type="file"
            id="bankDetails"
            name="bankDetails"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="file-input-group">
          <label htmlFor="aadharCard">Aadhaar Card Photocopy Front</label>

          <input
            type="file"
            id="aadharFront"
            name="aadharFront"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="file-input-group">
          <label htmlFor="aadharCard">Aadhaar Card Photocopy Back</label>

          <input
            type="file"
            id="aadharBack"
            name="aadharBack"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="file-input-group">
          <label htmlFor="panCard">PAN Card Photocopy</label>

          <input
            type="file"
            id="panCard"
            name="panCard"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="file-input-group">
  <label htmlFor="drivingLicense">Driving License Photocopy</label>
  <input
    type="file"
    id="drivingLicense"
    name="drivingLicense"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={handleInputChange}
    required={restaurant === 2}
  />
</div>


        <div className="file-input-group">
          <label htmlFor="currentAddressProof">
            Photocopy of Proof of Current Address
          </label>

          <input
            type="file"
            id="currentAddressProof"
            name="currentAddressProof"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Verify Button */}

      <button
        onClick={verifyPartnerDetails}
        className="verify-button"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default VerifyChef;
