import React, { useState, useEffect } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { IoMdBackspace } from "react-icons/io";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { FaEdit } from "react-icons/fa";
import EditPriceOneWayModal from "../EditPriceOneWayModal/EditPriceOneWayModal";
import axios from "axios";

const OneWayTrip = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [nightChargesEndAt, setNightChargesEndAt] = useState(""); // New Field
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [nightCharge, setNightCharge] = useState("");
  const [bookBefore, setBookBefore] = useState(1);
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1); // New Field
  const [summary, setSummary] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState([]);
  const [selectedCarType, setSelectedCarType] = useState([]); // Car type state
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditData, setCurrentEditData] = useState({});
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");
  const [additionalPriceHours, setAdditionalPriceHours] = useState("");

  const [gst, setGst] = useState(null);
  const [secureFees, setSecureFees] = useState(null);
  const [platformFees, setPlatformFees] = useState(null);

  const [loading, setLoading] = useState(false);

  const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury"];
  const transmissions = ["Manual", "Automatic"];

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
    setHourRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const [extraHourRows, setExtraHourRows] = useState([
    { id: 0, duration: "", price: "" },
  ]);

  const handleExtraDurationChange = (index, value) => {
    const newRows = [...extraHourRows];
    newRows[index].duration = value;
    setExtraHourRows(newRows);
  };

  const handleExtraPriceChange = (index, value) => {
    const newRows = [...extraHourRows];
    newRows[index].price = value;
    setExtraHourRows(newRows);
  };

  const handleAddExtraRow = () => {
    setExtraHourRows([
      ...extraHourRows,
      { id: extraHourRows.length, duration: "", price: "" },
    ]);
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
  const [formData, setFormData] = useState({
    category_id: "",
    sub_category_id: "",
    night_charge: "",
    free_cancellation_time_before: "",
    cancellation_policy: "",
    booking_summary: "",
    driver_hours_calculations: [{ hours: 1, price: 100 }],
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const invalidHourRow = hourRows.some(
      (row) =>
        !row.duration || row.duration <= 0 || !row.price || row.price <= 0
    );
    if (invalidHourRow) {
      toast.error(
        "Please fill out all duration and price fields before submitting."
      );
      return; // Prevent form submission if validation fails
    }
    const durations = hourRows.map((row) => String(row.duration).trim());
    console.log("Durations (normalized):", durations); // Log the normalized durations array

    const hasDuplicates = durations.some(
      (duration, index) => durations.indexOf(duration) !== index
    );
    console.log("Has duplicates:", hasDuplicates); // Log whether duplicates are found

    if (hasDuplicates) {
      toast.error("Duplicate durations are not allowed.");
      console.log("Form submission stopped due to duplicate durations."); // Log the reason for stopping the form submission
      return; // Stop execution to prevent form submission
    }

    const formData = new FormData();
    formData.append("category_id", 2);
    formData.append("sub_category_id", 5);
    formData.append("service_start_time", startTime);
    formData.append("service_end_time", endTime);
    formData.append("night_charge", nightCharge);
    formData.append("booking_time_before", bookBefore);
    formData.append("cancellation_time_before", cancellationBefore);
    formData.append("free_cancellation_time_before", freeCancellationBefore);
    formData.append("cancellation_policy", cancellationPolicy);
    formData.append("booking_summary", bookingSummaryPage);
    formData.append("booking_details", summary);
    formData.append("additional_price_hours", additionalPriceHours);
    formData.append("night_charge_start_time", nightChargesStartAt);
    formData.append("night_charge_end_time", nightChargesEndAt);
    formData.append("gst", gst || "");
    formData.append("secure_fee", secureFees || "");
    formData.append("platform_fee", platformFees || "");

    const driverHoursData = hourRows.map((row) => ({
      hours: row.duration,
      price: row.price,
    }));
    formData.append(
      "driver_hours_calculations",
      JSON.stringify(driverHoursData)
    );

    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Failed to update sub-category");
        console.error("Failed to update sub-category", response.statusText);
        return;
      }

      const result = await response.json();
      fetchSubCategoryData();
      toast.success("Sub-category updated successfully");
      console.log("Sub-category updated successfully:", result);
    } catch (error) {
      toast.error("Error during the API call");
      console.error("Error during the API call:", error);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24 * 60; i += 15) {
      const hours = Math.floor(i / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (i % 60).toString().padStart(2, "0");
      times.push(`${hours}:${minutes}`);
    }
    return times;
  };

  const [editingType, setEditingType] = useState(""); // 'main' or 'extra'

  const handleEditRow = (rowId) => {
    const rowData = hourRows.find((row) => row.id === rowId);
    if (rowData) {
      setCurrentEditData({
        id: rowData.id,
        duration: rowData.duration,
        price: rowData.price,
      });
      setEditingType("main");
      setShowEditModal(true);
    }
  };

  const handleEditExtraRow = (rowId) => {
    const rowData = extraHourRows.find((row) => row.id === rowId);
    if (rowData) {
      setCurrentEditData({
        id: rowData.id,
        duration: rowData.duration,
        price: rowData.price,
      });
      setEditingType("extra");
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = (updatedData) => {
    if (editingType === "main") {
      const updatedRows = hourRows.map((row) =>
        row.id === currentEditData.id
          ? {
              ...row,
              duration: updatedData.duration,
              price: updatedData.price,
            }
          : row
      );
      setHourRows(updatedRows);
    } else {
      const updatedRows = extraHourRows.map((row) =>
        row.id === currentEditData.id
          ? {
              ...row,
              duration: updatedData.duration,
              price: updatedData.price,
            }
          : row
      );
      setExtraHourRows(updatedRows);
    }
    setShowEditModal(false);
  };

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const data = response.data.data;
        setNightChargesStartAt(data.night_charge_start_time.slice(0, 5));
        setNightChargesEndAt(data.night_charge_end_time.slice(0, 5));
        setStartTime(data.service_start_time.slice(0, 5));
        setEndTime(data.service_end_time.slice(0, 5));
        setNightCharge(data.night_charge.slice(0, 5));
        setBookBefore(data.booking_time_before);
        setCancellationBefore(data.cancellation_time_before);
        setFreeCancellationBefore(data.free_cancellation_time_before);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setSelectedTransmission(data.transmission_types || []);
        setGst(data.gst || null);
        setSecureFees(data.secure_fee || null);
        setPlatformFees(data.platform_fee || null);
        setSelectedCarType(data.car_types || []);
        setCurrentEditData(data.current_edit_data || {});
        setShowEditModal(data.show_edit_modal || false);
        if (data.driver_hours_calculations.length > 0) {
          const mappedHours = data.driver_hours_calculations.map((item) => ({
            id: item.id, // Use the actual ID from the API response
            duration: item.hours || 1, // Map `hours` to `duration`
            price: parseFloat(item.price).toFixed(2), // Format price to 2 decimal places
          }));
          setHourRows(mappedHours);
        }
        setAdditionalPriceHours(data.additional_price_hours || {});
      } else {
        toast.error(
          response.data.message || "Failed to fetch sub-category data"
        );
      }
    } catch (error) {
      console.error("Error fetching sub-category data:", error);
      toast.error("Error fetching sub-category data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  const timeOptions = generateTimeOptions();

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">One Way Trip</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
            <label htmlFor="startTime" className="form-label">
              Start Time
            </label>
            <select
              className="form-control"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              <option value="" disabled>
                Select start time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="endTime" className="form-label">
              End Time
            </label>
            <select
              className="form-control"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              <option value="" disabled>
                Select end time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="nightChargesStartAt" className="form-label">
              Night Charges Start At
            </label>
            <select
              className="form-control"
              id="nightChargesStartAt"
              value={nightChargesStartAt}
              onChange={(e) => setNightChargesStartAt(e.target.value)}
              required
            >
              <option value="" disabled>
                Select time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="nightChargesEndAt" className="form-label">
              Night Charges End At
            </label>
            <select
              className="form-control"
              id="nightChargesEndAt"
              value={nightChargesEndAt}
              onChange={(e) => setNightChargesEndAt(e.target.value)}
              required
            >
              <option value="" disabled>
                Select time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
            <label htmlFor="bookBefore" className="form-label">
              Time Before Booking (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="bookBefore"
              value={bookBefore === null ? "" : bookBefore}
              onChange={(e) =>
                setBookBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
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
              value={cancellationBefore === null ? "" : cancellationBefore}
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
              }
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
              value={nightCharge === null ? "" : nightCharge}
              onChange={(e) =>
                setNightCharge(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              required
            />
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
            <label htmlFor="gst" className="form-label">
              GST
            </label>
            <input
              type="number"
              className="form-control"
              id="gst"
              value={gst === null ? "" : gst} // Set value to empty string when null
              onChange={(e) =>
                setGst(e.target.value === "" ? null : Number(e.target.value))
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="secureFees" className="form-label">
              Secure Fees
            </label>
            <input
              type="number"
              className="form-control"
              id="secureFees"
              value={secureFees === null ? "" : secureFees} // Set value to empty string when null
              onChange={(e) =>
                setSecureFees(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="platformFees" className="form-label">
              Platform Fees
            </label>
            <input
              type="number"
              className="form-control"
              id="platformFees"
              value={platformFees === null ? "" : platformFees} // Set value to empty string when null
              onChange={(e) =>
                setPlatformFees(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
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
            onClick={(e) => {
              handleSubmit(e);
              setTimeout(() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }, 500);
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default OneWayTrip;
