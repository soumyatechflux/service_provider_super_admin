import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./VerifyChef.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const VerifyChef = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // Add this state to track which button is loading
  const { restaurant, id, isVerify } = location.state || {};
  const [partnerDetails, setPartnerDetails] = useState([]);
  const navigate = useNavigate();

  const [cookDetails, setCookDetails] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    whatsapp: "",
    aadhaar: "",
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
  const fetchPartnerDetails = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.get(
        "https://api-serviceprovider.techfluxsolutions.com/api/admin/partners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            partner_id: id,
          },
        }
      );

      setLoading(false);

      if (response.status === 200 && response.data.success) {
        // Map the API response to your state structure
        const partnerData = response.data.data.find(
          (partner) => partner.id === parseInt(id)
        );

        if (partnerData) {
          setCookDetails({
            name: partnerData.name || "",
            email: partnerData.email || "",
            phone: partnerData.mobile || "",
            dob: partnerData.dob || "",
            aadhaar: partnerData.aadhaar|| "",
            address: partnerData.current_address || "",
            permanentAddress: partnerData.permanent_address || "",
            experience: partnerData.years_of_experience || "",
            subCategory: partnerData.specialisation || "",
            dateOfJoining: partnerData.date_of_joining || "",
            languages: partnerData.languages || "",
            drivingLicenseNumber: partnerData.driving_license_number || "",
            licenseExpiryDate: partnerData.driving_license_expiry_date || "",
            carType: partnerData.car_type || "",
            transmissionType: partnerData.transmission_type || "",
            cuisines: partnerData.cuisines || "",
            aadharFront: partnerData.aadhar_front || "",
            aadharBack: partnerData.aadhar_back || "",
            panCard: partnerData.pancard || "",
            bankDetails: partnerData.bank_passbook || "",
            drivingLicense: partnerData.driving_licence || "",
            currentAddressProof: partnerData.address_proof || "",
            vegNonVeg: partnerData.veg_non_veg || "",
            category_id: partnerData.category_id || "",
            account_holder_name: partnerData.account_holder_name || "",
            account_number: partnerData.account_number || "",
            ifsc_code: partnerData.ifsc_code || "",
            bank_name: partnerData.bank_name || "",
            whatsapp_no: partnerData.whatsapp_no || "",
          });
        } else {
          toast.error("Partner not found");
        }
      } else {
        toast.error(response.data.message || "Failed to fetch partner details");
      }
    } catch (error) {
      console.error("Error fetching partner details:", error);
      toast.error("Failed to fetch partner details. Please try again.");
      setLoading(false);
    }
  };

  // Call the fetch function when component mounts
  useEffect(() => {
    if (id) {
      fetchPartnerDetails();
    }
  }, [id]);

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
    { value: "hatchback", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "luxury", label: "Luxury" },
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
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
      [name]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleInputChangeCategory = (name, value) => {
    setCookDetails((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "category_id" && { subCategory: "" }), // Reset subCategory when category changes
    }));
  };

  const verificationHeadings = {
    1: "Cook Verification",
    2: "Driver Verification",
    3: "Gardener Verification",
  };

  const categoryOptions = [
    { value: "1", label: "Cook" },
    { value: "2", label: "Driver" },
    { value: "3", label: "Gardener" },
  ];

  const specializationOptions = {
    1: [
      { value: "cook_one_meal", label: "Cook for One Meal" },
      { value: "cook_one_day", label: "Cook for One Day" },
      { value: "chef_party", label: "Chef for Party" },
    ],
    2: [
      { value: "round_trip", label: "Round Trip" },
      { value: "one_way_trip", label: "One Way Trip" },
      { value: "one_day_ride", label: "One Day Ride" },
      { value: "outstation_round_trip", label: "Outstation Round Trip" },
    ],
    3: [
      { value: "one_time_visit", label: "One Time Visit" },
      { value: "monthly_subscription", label: "Monthly Subscription" },
    ],
  };

  const cuisineOptions = [
    { value: "north_indian", label: "North Indian" },
    { value: "south_indian", label: "South Indian" },
    { value: "chinese", label: "Chinese" },
    { value: "italian", label: "Italian" },
    { value: "mexican", label: "Mexican" },
    { value: "thai", label: "Thai" },
    { value: "japanese", label: "Japanese" },
    { value: "continental", label: "Continental" },
  ];

  const vegNonVegOptions = [
    { value: "Veg", label: "Veg" },
    { value: "Non-Veg", label: "Non-Veg" },
  ];
  const heading = verificationHeadings[restaurant] || "Default Verification";

  const handlePartnerDetails = async (action) => {
    // Only validate required fields for verify action
    if (action === "verify") {
      const requiredFields = [
        "dob",
        "email",
        "aadhaar",
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
      const missingFields = requiredFields.filter(
        (field) => !cookDetails[field]
      );
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
    }

    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      const formData = new FormData();

      // Only append fields that have values
      if (cookDetails.name) formData.append("name", cookDetails.name);
      if (cookDetails.email) formData.append("email", cookDetails.email);
      if (cookDetails.phone) formData.append("mobile", cookDetails.phone);
      if (cookDetails.dob) {
        // Extract YYYY-MM-DD from the ISO string
        const formattedDOB = new Date(cookDetails.dob)
          .toISOString()
          .split("T")[0];
        formData.append("dob", formattedDOB);
      }

      if (cookDetails.licenseExpiryDate) {
        // Extract YYYY-MM-DD from the ISO string
        const formattedDate = new Date(cookDetails.licenseExpiryDate)
          .toISOString()
          .split("T")[0];
        formData.append("driving_license_expiry_date", formattedDate);
      }

      if (cookDetails.aadhaar) formData.append("aadhaar", cookDetails.aadhaar);
      if (cookDetails.address)
        formData.append("current_address", cookDetails.address);
      if (cookDetails.permanentAddress)
        formData.append("permanent_address", cookDetails.permanentAddress);
      if (cookDetails.experience)
        formData.append("years_of_experience", cookDetails.experience);
      if (cookDetails.subCategory)
        formData.append("specialisation", cookDetails.subCategory);
      if (cookDetails.dateOfJoining) {
        const formattedDateOfJoining = new Date(cookDetails.dateOfJoining)
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD
        formData.append("date_of_joining", formattedDateOfJoining);
      }
      if (cookDetails.languages)
        formData.append("languages", cookDetails.languages);
      if (cookDetails.drivingLicenseNumber)
        formData.append(
          "driving_license_number",
          cookDetails.drivingLicenseNumber
        );
      if (cookDetails.carType) formData.append("car_type", cookDetails.carType);
      if (cookDetails.transmissionType)
        formData.append("transmission_type", cookDetails.transmissionType);
      if (cookDetails.cuisines)
        formData.append("cuisines", cookDetails.cuisines);
      if (cookDetails.aadharFront)
        formData.append("aadhar_front", cookDetails.aadharFront);
      if (cookDetails.aadharBack)
        formData.append("aadhar_back", cookDetails.aadharBack);
      if (cookDetails.panCard) formData.append("pancard", cookDetails.panCard);
      if (cookDetails.bankDetails)
        formData.append("bank_passbook", cookDetails.bankDetails);
      if (cookDetails.drivingLicense)
        formData.append("driving_licence", cookDetails.drivingLicense);
      if (cookDetails.currentAddressProof)
        formData.append("address_proof", cookDetails.currentAddressProof);
      if (cookDetails.vegNonVeg)
        formData.append("veg_non_veg", cookDetails.vegNonVeg);
      if (cookDetails.category_id)
        formData.append("category_id", cookDetails.category_id);
      if (cookDetails.account_holder_name)
        formData.append("account_holder_name", cookDetails.account_holder_name);
      if (cookDetails.account_number)
        formData.append("account_number", cookDetails.account_number);
      if (cookDetails.ifsc_code)
        formData.append("ifsc_code", cookDetails.ifsc_code);
      if (cookDetails.bank_name)
        formData.append("bank_name", cookDetails.bank_name);
      if (cookDetails.whatsapp_no)
        formData.append("whatsapp_no", cookDetails.whatsapp_no);

      // Always append these fields
      formData.append("partner_id", id);
      formData.append("save_or_verify", action);

      // Only append is_verify if action is 'verify'
      if (action === "verify") {
        formData.append("is_verify", isVerify);
      }

      setLoading(true);
      setLoadingAction(action);

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
      setLoadingAction(null); // Clear loading state regardless of success/failure

      if (response.status === 200 && response.data.success) {
        toast.success(
          action === "verify"
            ? "Partner verified successfully!"
            : "Partner details saved successfully!"
        );
        navigate("/partners");
      } else {
        toast.error(
          response.data.message ||
            `${action === "verify" ? "Verification" : "Saving"} failed.`
        );
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Failed to ${action} partner. Please try again.`);
      setLoading(false);
      setLoadingAction(null); // Clear loading state regardless of success/failure
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
          <label>
            Full Name <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="name"
            value={partnerDetails?.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />

          <label>
            Mobile Number <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="phone"
            value={partnerDetails?.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
          />

          <label>
            WhatsApp Number<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="whatsapp_no"
            value={cookDetails?.whatsapp_no}
            onChange={handleInputChange}
            placeholder="Enter WhatsApp Number"
            required
          />

          <label>
            Email <span style={{ color: "red" }}>*</span>
          </label>

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
          <label>
            Cuisines <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="cuisines"
            options={cuisineOptions}
            value={cuisineOptions.filter((option) =>
              cookDetails.cuisines.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("cuisines", selectedOptions)
            }
            required
            placeholder="Select Cuisines"
          />

          <label>
            Veg / Non-Veg <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="vegNonVeg"
            options={vegNonVegOptions}
            value={vegNonVegOptions.filter((option) =>
              cookDetails.vegNonVeg.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("vegNonVeg", selectedOptions)
            }
            required
            placeholder="Select Veg / Non-Veg"
          />
        </>
      )}

      {restaurant === 2 && (
        <>
          <label>
            Driving License Number <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="drivingLicenseNumber"
            value={cookDetails?.drivingLicenseNumber}
            onChange={handleInputChange}
            placeholder="Enter driving license number"
            required
          />

          <label>
            License Expiry Date <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="date"
            name="licenseExpiryDate"
            value={
              cookDetails?.licenseExpiryDate
                ? new Date(cookDetails.licenseExpiryDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            required
          />

          <label>
            Car Type <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="carType"
            options={carOptions}
            value={carOptions.filter((option) =>
              cookDetails.carType.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("carType", selectedOptions)
            }
            required
          />

          <label>
            Transmission Type <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="transmissionType"
            options={transmissionOptions}
            value={transmissionOptions.filter((option) =>
              cookDetails.transmissionType.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("transmissionType", selectedOptions)
            }
            required
          />
        </>
      )}

      {/* Common Fields */}
      <label>
        Date of Birth <span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="date"
        name="dob"
        value={
          cookDetails?.dob
            ? new Date(cookDetails.dob).toISOString().split("T")[0]
            : ""
        }
        onChange={handleInputChange}
        placeholder="Enter Date of Birth"
        required
      />

      <div className="additional-details mt-2">
        <label>
          Gender <span style={{ color: "red" }}>*</span>
        </label>

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

        <label>
          Aadhar Card Number <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="aadhaar"
          value={cookDetails?.aadhaar}
          onChange={handleInputChange}
          placeholder="Enter Aadhar card number"
          required
        />

        <label>
          Current Address <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="address"
          value={cookDetails.address}
          onChange={handleInputChange}
          placeholder="Enter current address"
          required
        />

        <label>
          Permanent Address <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="permanentAddress"
          value={cookDetails.permanentAddress}
          onChange={handleInputChange}
          placeholder="Enter permanent address"
          required
        />

        <label>
          Years of Experience <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="number"
          name="experience"
          value={cookDetails?.experience}
          onChange={handleInputChange}
          placeholder="Enter years of experience"
          required
        />
        <label>
          Category <span style={{ color: "red" }}>*</span>
        </label>
        <select
          name="category_id" // Updated to category_id
          value={cookDetails.category_id}
          onChange={(e) =>
            handleInputChangeCategory("category_id", e.target.value)
          }
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
        <label>
          Specialization / Sub Category <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          isMulti // Enables multiple selections
          name="subCategory"
          value={
            specializationOptions[cookDetails.category_id]?.filter((option) =>
              cookDetails.subCategory.includes(option.value)
            ) || []
          }
          onChange={(selectedOptions) =>
            handleInputChangeCategory(
              "subCategory",
              selectedOptions.map((option) => option.value)
            )
          }
          options={specializationOptions[cookDetails.category_id] || []}
          isDisabled={!cookDetails.category_id} // Disable if no category selected
          placeholder="Select Specialization / Sub Category"
        />

        <label>
          Date of Joining <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="date"
          name="dateOfJoining"
          value={
            cookDetails?.dateOfJoining
              ? new Date(cookDetails.dateOfJoining).toISOString().split("T")[0]
              : ""
          }
          onChange={handleInputChange}
          required
        />

        <label>
          Languages <span style={{ color: "red" }}>*</span>
        </label>

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

      <label>
        Account Holder Name <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="account_holder_name"
        value={cookDetails?.account_holder_name}
        onChange={handleInputChange}
        placeholder="Enter Account Holder Name"
        required
      />

      <label>
        Bank Name <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="bank_name"
        value={cookDetails?.bank_name}
        onChange={handleInputChange}
        placeholder="Enter Bank Name"
        required
      />

      <label>
        Account Number <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="account_number"
        value={cookDetails?.account_number}
        onChange={handleInputChange}
        placeholder="Enter Account Number"
        required
      />

      <label>
        IFSC Code <span style={{ color: "red" }}>*</span>
      </label>
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
          <label htmlFor="drivingLicense">Driving License Photocopy </label>
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
      <div className="button-aliangment">
        <button
          onClick={() => handlePartnerDetails("save")}
          className="verify-button"
          disabled={loadingAction !== null} // Disable both buttons while either is loading
          style={{ width: "40%" }}
        >
          {loadingAction === "save" ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => handlePartnerDetails("verify")}
          className="verify-button"
          disabled={loadingAction !== null} // Disable both buttons while either is loading
          style={{ width: "40%" }}
        >
          {loadingAction === "verify" ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerifyChef;
