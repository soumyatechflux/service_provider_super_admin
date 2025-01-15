import React, { useState, useEffect } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { IoMdBackspace } from "react-icons/io";
import { HiPlusSmall } from "react-icons/hi2";
import { BiMinus } from "react-icons/bi";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { FaEdit } from "react-icons/fa";
import EditPriceModal from "../EditPriceModal/EditPriceModal";
import axios from "axios";

const OutStationTrip = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [bookBefore, setBookBefore] = useState(1);
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1); // New Field
  const [summary, setSummary] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState([]);
  const [selectedCarType, setSelectedCarType] = useState([]); // Car type state
  const [currentEditData, setCurrentEditData] = useState({});
  const [nightCharge, setNightCharge] = useState([]);
    const [loading, setLoading] = useState(false);
      const [additionalPriceHours, setAdditionalPriceHours] = useState("");
  
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");

  const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury"];
  const transmissions = ["Manual", "Automatic"];

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;

        // Populate state with API data
        setStartTime(data.service_start_time.slice(0, 5));
        setEndTime(data.service_end_time.slice(0, 5));
        setNightChargesStartAt(data.night_charge_start_time.slice(0, 5));
        setBookBefore(data.booking_time_before || 1);
        setCancellationBefore(data.free_cancellation_time_before || 1);
        setFreeCancellationBefore(data.free_cancellation_time_before || 1);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setNightCharge(data.night_charge || "");
        setAdditionalPriceHours(data.additional_price_hours || {});

        // Map driver hours calculations to hourRows
        // Map driver hours calculations to hourRows
        if (data.driver_hours_calculations.length > 0) {
          const mappedHours = data.driver_hours_calculations.map((item) => ({
            id: item.id, // Use the actual ID from the API response
            duration: item.hours || 1, // Map `hours` to `duration`
            price: parseFloat(item.price).toFixed(2), // Format price to 2 decimal places
          }));
          setHourRows(mappedHours);
        }

        // Map driver km calculations to extraHourRows
        if (data.driver_km_calculations.length > 0) {
          const mappedExtraHours = data.driver_km_calculations.map(
            (item, index) => ({
              id: index,
              duration: item.duration || "",
              price: parseFloat(item.price).toFixed(2),
            })
          );
          setExtraHourRows(mappedExtraHours);
        }
      } else {
        toast.error("Failed to fetch sub-category data.");
      }
    } catch (error) {
      console.error("Error fetching sub-category data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  const handleCarTypeChange = (type) => {
    setSelectedCarType((prev) =>
      prev.includes(type)
        ? prev.filter((carType) => carType !== type)
        : [...prev, type]
    );
  };

  const [hourRows, setHourRows] = useState([
    { id: 0, count: 1, duration: "", price: "" },
  ]);

  const handleAddRow = () => {
    setHourRows((prevRows) => [
      ...prevRows,
      { id: Date.now(), hours: "", price: "" }, // Using Date.now() for unique id
    ]);
  };
  const handleRemoveRow = (id) => {
    if (hourRows.length > 1) {
      setHourRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one guest slot is required.");
    }
  };

  const [extraHourRows, setExtraHourRows] = useState([
    { id: 0, duration: "", price: "" },
  ]);

  const handleExtraDurationChange = (index, value) => {
    const newRows = [...extraHourRows];
    newRows[index].duration = value;
    setExtraHourRows(newRows);
  };

  

  const handleRemoveExtraRow = (id) => {
    if (extraHourRows.length > 1) {
      setExtraHourRows(extraHourRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one extra charge slot is required.");
    }
  };

  const handleCountChange = (index, increment) => {
    const newRows = [...hourRows];

    if (increment && newRows[index].count >= 15) {
      toast.error("Guest count cannot exceed 15.");
      return;
    }

    newRows[index].count = increment
      ? newRows[index].count + 1
      : Math.max(newRows[index].count - 1, 1);

    setHourRows(newRows);
  };

  const handleDurationChange = (index, value) => {
    const newRows = [...hourRows];
    newRows[index].duration = value;
    setHourRows(newRows);
  };

  const handlePriceChange = (index, value) => {
    const newRows = [...hourRows];
    newRows[index].price = value;
    setHourRows(newRows);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
    // Create FormData object
    const formData = new FormData();
  
    // Add required fields
    formData.append("category_id", 2); // Example category ID for "Driver"
    formData.append("sub_category_id", 6); // Example sub-category ID for "One Day Ride"
    formData.append("service_start_time", startTime);
    formData.append("service_end_time", endTime);
    formData.append("night_charge_start_time", nightChargesStartAt);
    formData.append("booking_time_before", bookBefore);
    formData.append("cancellation_time_before", cancellationBefore);
    formData.append("free_cancellation_time_before", freeCancellationBefore);
    formData.append("cancellation_policy", cancellationPolicy);
    formData.append("booking_summary", bookingSummaryPage);
    formData.append("additional_price_hours", additionalPriceHours);
  
    // Add driver hours calculations data
    const driverHoursData = hourRows.map((row) => ({
      hours: row.duration, // Map duration to hours
      price: row.price,
    }));
    formData.append("driver_hours_calculations", JSON.stringify(driverHoursData));
  
    // Add other optional fields if required
    formData.append("night_charge", nightCharge || "");
  
    // Loading state
    setLoading(true);
  
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        toast.success("Sub-category updated successfully!");
        fetchSubCategoryData(); // Refresh the data after update
      } else {
        toast.error(response.data.message || "Failed to update sub-category.");
      }
    } catch (error) {
      console.error("Error updating sub-category:", error);
      toast.error("An error occurred while updating the sub-category.");
    } finally {
      setLoading(false);
    }
  };
  

  const [editingType, setEditingType] = useState(""); // 'main' or 'extra'

  

  

 

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">One Day Ride</h3>
      <form onSubmit={handleSubmit}>
        {/* Start Time, End Time, Night Charges Start At */}

        {/* Booking and Cancellation Fields */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
            <label htmlFor="bookBefore" className="form-label">
              Time Before Booking (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="bookBefore"
              value={bookBefore === null ? "" : bookBefore} // Set value to empty string when null
              onChange={(e) =>
                setBookBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              // min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="cancellationBefore" className="form-label">
              Time Before Cancellation (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="cancellationBefore"
              value={cancellationBefore === null ? "" : cancellationBefore} // Set value to empty string when null
              onChange={(e) =>
                setCancellationBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="freeCancellationBefore" className="form-label">
              Free Cancellation Before (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="freeCancellationBefore"
              value={
                freeCancellationBefore === null ? "" : freeCancellationBefore
              } // Set value to empty string when null
              onChange={(e) =>
                setFreeCancellationBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="nightCharges" className="form-label">
              Night Charges (in currency)
            </label>
            <input
              type="number"
              className="form-control"
              id="nightCharges"
              placeholder="Enter charges"
              min="0"
              value={nightCharge === null ? "" : nightCharge} // Set value to empty string when null
              onChange={(e) =>
                setNightCharge(
                  e.target.value === "" ? null : Number(e.target.value) // Correct state update
                )
              }
              required
            />
          </div>
        </div>

        {/* Guest Time Slot Section */}
        <div className="MainDining_AddTable mb-5 mt-5">
                  <p className="Subheading1_AddTable">Time duration and price</p>
                  <div className="row" style={{ justifyContent: "center" }}>
                    {hourRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="row mb-3"
                        style={{
                          backgroundColor: "#F6F8F9",
                          justifyContent: "center",
                          width: "-webkit-fill-available",
                        }}
                      >
                        <div className="col-12 col-md-5 p-4">
                          <div className="Subheading2_AddTable">
                            DURATION (in hours) <span className="text-danger">*</span>
                          </div>
                          <div className="seating_AddTable">
                            <div className="component-guest1">
                              <input
                                type="number"
                                value={row.duration || ""}
                                onChange={(e) =>
                                  handleDurationChange(index, e.target.value)
                                }
                                className="form-control"
                                placeholder="Enter duration in hours"
                                min="1"
                                required
                              />
                            </div>
                          </div>
                        </div>
        
                        <div className="col-12 col-md-5 p-4">
                          <div className="Subheading2_AddTable">
                            PRICE <span className="text-danger">*</span>
                          </div>
                          <div className="seating_AddTable">
                            <input
                              type="number"
                              value={row.price || ""}
                              onChange={(e) => handlePriceChange(index, e.target.value)}
                              className="form-control"
                              placeholder="Enter price"
                              min="0"
                              required
                            />
                          </div>
                        </div>
        
                        <div
                          className="col-12 col-md-2 p-4 mt-4 d-flex align-items-center"
                          style={{ justifyContent: "space-evenly" }}
                        >
                          
                          <IoMdBackspace
                            className="svg_AddTable"
                            onClick={() => handleRemoveRow(row.id)}
                            style={{ fontSize: "25px" }}
                          />
                          {index === hourRows.length - 1 && (
                            <HiPlus
                              className="svg_AddTable"
                              style={{ fontSize: "25px" }}
                              onClick={handleAddRow}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

        {/* Extra Charges Section */}
         <div className="MainDining_AddTable mb-5 mt-5">
                  <p className="Subheading1_AddTable">
                    Extra Charges According to Minutes
                  </p>
                  <div className="row" style={{ justifyContent: "center" }}>
                    {extraHourRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="row mb-3"
                        style={{
                          backgroundColor: "#F6F8F9",
                          justifyContent: "center",
                          width: "-webkit-fill-available",
                        }}
                      >
                        <div className="col-12 col-md-5 p-4">
                          <div className="Subheading2_AddTable">
                            EXTRA Minutes (in minutes){" "}
                            <span className="text-danger">*</span>
                          </div>
                          <div className="seating_AddTable">
                            <input
                              type="number"
                              value={row.hours !== undefined ? row.hours : 1}
                              onChange={(e) =>
                                handleExtraDurationChange(index, e.target.value)
                              }
                              className="form-control"
                              placeholder="Enter extra minutes"
                              min="1"
                              required
                            />
                          </div>
                        </div>
        
                        <div className="col-12 col-md-5 p-4">
                          <div className="Subheading2_AddTable">
                            EXTRA CHARGES (in currency){" "}
                            <span className="text-danger">*</span>
                          </div>
                          <div className="seating_AddTable">
                            <input
                              type="number"
                              value={additionalPriceHours} // Use the state variable
                              onChange={(e) => setAdditionalPriceHours(e.target.value)} // Update the state on change
                              className="form-control"
                              placeholder="Enter extra charges"
                              min="0"
                              required
                            />
                          </div>
                        </div>
        
                        
                      </div>
                    ))}
                  </div>
                </div>

        {/* Transmission Type Section */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">Select Transmission Type</p>
          <div className="row">
            {transmissions.map((type, index) => (
              <div key={type} className="col-md-4 d-flex align-items-center">
                <span>
                  {index + 1}. {type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Car Type Section */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">Select Car Type</p>
          <div className="row">
            {carTypes.map((type, index) => (
              <div key={type} className="col-md-4 d-flex align-items-center">
                <span>
                  {index + 1}. {type}
                </span>
              </div>
            ))}
          </div>
        </div>



        <div className="MainDining_AddTable mb-5 mt-5">
          <h4 className="form-label">
            Additional Details (Booking Details Summary)
          </h4>
          <ReactQuill
            value={summary}
            onChange={setSummary}
            placeholder="Write the booking details here..."
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["blockquote"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
              ],
            }}
          />
        </div>

        {/* Cancellation Policy Editor */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <h4 className="form-label">Cancellation Policy</h4>
          <ReactQuill
            value={cancellationPolicy}
            onChange={setCancellationPolicy}
            placeholder="Write the cancellation policy here..."
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["blockquote"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
              ],
            }}
          />
        </div>

        {/* Booking Summary Page Editor */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <h4 className="form-label">
            Additional Details (Booking Summary Page)
          </h4>
          <ReactQuill
            value={bookingSummaryPage}
            onChange={setBookingSummaryPage}
            placeholder="Write the booking summary page content here..."
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["blockquote"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
              ],
            }}
          />
        </div>

       

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            className="btn btn-primary w-50 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OutStationTrip;
