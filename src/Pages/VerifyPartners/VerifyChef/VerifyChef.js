import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./VerifyChef.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';


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
    transmissionType: "",
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

  const carOptions = [
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'luxury', label: 'Luxury' },
  ];

  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
  ];

  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setCookDetails((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleInputChangeCar = (name, selectedOptions) => {
    setCookDetails((prevState) => ({
      ...prevState,
      [name]: selectedOptions.map(option => option.value),
    }));
  };

  const handleInputChangeCategory = (name, value) => {
    setCookDetails((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === 'category_id' && { subCategory: '' }), // Reset subCategory when category changes
    }));
  };

  
 
  const verificationHeadings = {
    1: "Cook Verification",
    2: "Driver Verification",
    3: "Gardener Verification",
  };


  const categoryOptions = [
    { value: '1', label: 'Cook' },
    { value: '2', label: 'Driver' },
    { value: '3', label: 'Gardener' },
  ];

  const specializationOptions = {
    '1': [
      { value: 'cook_one_meal', label: 'Cook for One Meal' },
      { value: 'cook_one_day', label: 'Cook for One Day' },
      { value: 'chef_party', label: 'Chef for Party' },
    ],
    '2': [
      { value: 'round_trip', label: 'Round Trip' },
      { value: 'one_way_trip', label: 'One Way Trip' },
      { value: 'one_day_ride', label: 'One Day Ride' },
      { value: 'outstation_round_trip', label: 'Outstation Round Trip' },
    ],
    '3': [
      { value: 'one_time_visit', label: 'One Time Visit' },
      { value: 'monthly_subscription', label: 'Monthly Subscription' },
    ],
  };

  const cuisineOptions = [
    { value: 'north_indian', label: 'North Indian' },
    { value: 'south_indian', label: 'South Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'thai', label: 'Thai' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'continental', label: 'Continental' },
  ];

  const vegNonVegOptions = [
    { value: 'Veg', label: 'Veg' },
    { value: 'Non-Veg', label: 'Non-Veg' },
  ];
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
      toast.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
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
      formData.append("transmission_type", cookDetails.transmissionType);
      formData.append("cuisines", cookDetails.cuisines);
      formData.append("aadhar_front", cookDetails.aadharFront);
      formData.append("aadhar_back", cookDetails.aadharBack);
      formData.append("pancard", cookDetails.panCard);
      formData.append("bank_passbook", cookDetails.bankDetails);
      formData.append("driving_licence", cookDetails.drivingLicense);
      formData.append("address_proof", cookDetails.currentAddressProof);
      formData.append("partner_id", id);
      formData.append("is_verify", isVerify);
      formData.append("veg_non_veg", cookDetails.vegNonVeg);
      formData.append("category_id", cookDetails.category_id); 
      formData.append("account_holder_name", cookDetails.account_holder_name);
formData.append("account_number", cookDetails.account_number);
formData.append("ifsc_code", cookDetails.ifsc_code);
formData.append("bank_name", cookDetails.bank_name);
formData.append("whatsapp_no", cookDetails.whatsapp_no); 


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

<label>WhatsApp Number</label>
<input
  type="text"
  name="whatsapp_no"
  value={cookDetails?.whatsapp_no}
  onChange={handleInputChange}
  placeholder="Enter WhatsApp Number"
  required
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
      <Select
        isMulti
        name="cuisines"
        options={cuisineOptions}
        value={cuisineOptions.filter(option => cookDetails.cuisines.includes(option.value))}
        onChange={(selectedOptions) => handleInputChangeCar('cuisines', selectedOptions)}
        required
        placeholder="Select Cuisines"
      />

<label>Veg / Non-Veg</label>
      <Select
        isMulti
        name="vegNonVeg"
        options={vegNonVegOptions}
        value={vegNonVegOptions.filter(option => cookDetails.vegNonVeg.includes(option.value))}
        onChange={(selectedOptions) => handleInputChangeCar('vegNonVeg', selectedOptions)}
        required
        placeholder="Select Veg / Non-Veg"
      />
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
      <Select
        isMulti
        name="carType"
        options={carOptions}
        value={carOptions.filter(option => cookDetails.carType.includes(option.value))}
        onChange={(selectedOptions) => handleInputChangeCar('carType', selectedOptions)}
        required
      />

      <label>Transmission Type</label>
      <Select
        isMulti
        name="transmissionType"
        options={transmissionOptions}
        value={transmissionOptions.filter(option => cookDetails.transmissionType.includes(option.value))}
        onChange={(selectedOptions) => handleInputChangeCar('transmissionType', selectedOptions)}
        required
      />
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
<select
        name="category_id" // Updated to category_id
        value={cookDetails.category_id}
        onChange={(e) => handleInputChangeCategory('category_id', e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categoryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Specialization Dropdown (Dynamic Based on Category) */}
      <label>Specialization / Sub Category</label>
      <select
        name="subCategory"
        value={cookDetails.subCategory}
        onChange={(e) => handleInputChangeCategory('subCategory', e.target.value)}
        required
        disabled={!cookDetails.category_id} // Disable dropdown if no category is selected
      >
        <option value="">Select Specialization / Sub Category</option>
        {specializationOptions[cookDetails.category_id]?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
      <h2 className="mt-2">Bank Details</h2>

      <label>Account Holder Name</label>
<input
  type="text"
  name="account_holder_name"
  value={cookDetails?.account_holder_name}
  onChange={handleInputChange}
  placeholder="Enter Account Holder Name"
  required
/>

<label>Bank Name</label>
<input
  type="text"
  name="bank_name"
  value={cookDetails?.bank_name}
  onChange={handleInputChange}
  placeholder="Enter Bank Name"
  required
/>

<label>Account Number</label>
<input
  type="text"
  name="account_number"
  value={cookDetails?.account_number}
  onChange={handleInputChange}
  placeholder="Enter Account Number"
  required
/>

<label>IFSC Code</label>
<input
  type="text"
  name="ifsc_code"
  value={cookDetails?.ifsc_code}
  onChange={handleInputChange}
  placeholder="Enter IFSC Code"
  required
/>




      {error && <p className="error-message">{error}</p>}

      <div className="document-section">
        <h2 className="mt-2">Documents</h2>
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