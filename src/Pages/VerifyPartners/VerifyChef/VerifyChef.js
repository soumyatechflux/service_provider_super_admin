import React, { useState } from "react";
import "./VerifyChef.css";


const VerifyChef = ({ restaurant }) => {
  // Dummy data for testing
  const restaurantData = { id: 3 };  // Change this to test different IDs (1, 2, or 3)

  const [cookDetails, setCookDetails] = useState({
    name: "John Doe",
    phone: "9876543210",
    email: "abc@gmail.com",
    gender: "",
    whatsapp: "",
    aadhar: "",
    address: "123, Main Street, New Delhi",
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
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCookDetails({ ...cookDetails, [name]: files[0] });
    } else {
      setCookDetails({ ...cookDetails, [name]: value });
    }
  };

  const verificationHeadings = {
    1: "Cook Verification",
    2: "Driver Verification",
    3: "Gardener Verification",
  };

  const heading =
    verificationHeadings[restaurantData?.id] || "Default Verification";

  const handleSubmit = () => {
    const requiredFields = [
      "name", "phone", "aadhar", "experience", "address", "gender", 
      "category", "subCategory", "dateOfJoining", "languages",
    ];

    for (const field of requiredFields) {
      if (!cookDetails[field]) {
        setError("All fields are required!");
        return;
      }
    }

    if (!/^\d{12}$/.test(cookDetails.aadhar)) {
      setError("Aadhar card number must be a valid 12-digit number.");
      return;
    }

    setError("");
    alert("Verification successful!");
    console.log(cookDetails);
  };

  return (
    <div className="verification-container">
      <h2>{heading}</h2>

      {/* Basic Fields */}
      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <span>{cookDetails.name[0]}</span>
          </div>
        </div>

        <div className="details-section">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={cookDetails.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />
          <label>Mobile Number</label>
          <input
            type="text"
            name="phone"
            value={cookDetails.phone}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={cookDetails.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
          />
        </div>
      </div>

      {/* Additional Fields Based on ID */}
      {restaurantData?.id === 1 && (
        <>
          <label>Cuisines</label>
          <input
            type="text"
            name="cuisines"
            value={cookDetails.cuisines}
            onChange={handleInputChange}
            placeholder="Enter cuisines"
          />
          <label>Veg / Non-Veg</label>
          <select
            name="vegNonVeg"
            value={cookDetails.vegNonVeg}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </>
      )}

      {restaurantData?.id === 2 && (
        <>
          <label>Driving License Number</label>
          <input
            type="text"
            name="drivingLicenseNumber"
            value={cookDetails.drivingLicenseNumber}
            onChange={handleInputChange}
            placeholder="Enter driving license number"
          />
          <label>License Expiry Date</label>
          <input
            type="date"
            name="licenseExpiryDate"
            value={cookDetails.licenseExpiryDate}
            onChange={handleInputChange}
          />
          <label>Car Type</label>
          <select
            name="carType"
            value={cookDetails.carType}
            onChange={handleInputChange}
          >
            <option value="">Select Car Type</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </>
      )}

      {/* Common Fields */}
      <div className="additional-details mt-2">
        <label>Gender</label>
        <select
          name="gender"
          value={cookDetails.gender}
          onChange={handleInputChange}
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
          value={cookDetails.aadhar}
          onChange={handleInputChange}
          placeholder="Enter Aadhar card number"
        />
        <label>Current Address</label>
        <input
          type="text"
          name="address"
          value={cookDetails.address}
          onChange={handleInputChange}
          placeholder="Enter current address"
        />
        <label>Permanent Address</label>
        <input
          type="text"
          name="permanentAddress"
          value={cookDetails.permanentAddress}
          onChange={handleInputChange}
          placeholder="Enter permanent address"
        />
        <label>Years of Experience</label>
        <input
          type="number"
          name="experience"
          value={cookDetails.experience}
          onChange={handleInputChange}
          placeholder="Enter years of experience"
        />
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={cookDetails.category}
          onChange={handleInputChange}
          placeholder="Enter category"
        />
        <label>Specialization / Sub Category</label>
        <input
          type="text"
          name="subCategory"
          value={cookDetails.subCategory}
          onChange={handleInputChange}
          placeholder="Enter specialization / sub-category"
        />
        <label>Date of Joining</label>
        <input
          type="date"
          name="dateOfJoining"
          value={cookDetails.dateOfJoining}
          onChange={handleInputChange}
        />
        <label>Languages</label>
        <input
          type="text"
          name="languages"
          value={cookDetails.languages}
          onChange={handleInputChange}
          placeholder="Enter languages (comma-separated)"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="document-section">
        <h2>Documents</h2>

        <div className="file-input-group">
          <label htmlFor="bankDetails">Bank Passbook Photocopy</label>
          <input
            type="file"
            id="bankDetails"
            name="bankDetails"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
          />
        </div>

        <div className="file-input-group">
          <label htmlFor="aadharCard">Aadhaar Card Photocopy</label>
          <input
            type="file"
            id="aadharCard"
            name="aadharCard"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
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
          />
        </div>
      </div>

      {/* Verify Button */}
      <button onClick={handleSubmit} className="verify-button">
        Verify
      </button>
    </div>
  );
};

export default VerifyChef;
