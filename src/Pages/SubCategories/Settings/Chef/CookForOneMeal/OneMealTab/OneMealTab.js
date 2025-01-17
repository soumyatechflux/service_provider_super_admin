import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { HiPlusSmall } from "react-icons/hi2";
import { IoMdBackspace } from "react-icons/io";
import ReactQuill from "react-quill"; // Import the ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import the Quill styles
import { toast } from "react-toastify";
import "./OneMealTab.css"; // Import your CSS for styling

const OneMealTab = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [nightChargesEndAt, setNightChargesEndAt] = useState("");
  const [bookBefore, setBookBefore] = useState(1);
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [night_charge, setNightCharge] = useState([]);
  const [guestRows, setGuestRows] = useState([
    { id: 0, count: 1, duration: "", price: "" },
  ]);
  const [summary, setSummary] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  
  const [gst, setGst] = useState(null);
  const [secureFees, setSecureFees] = useState(null);
  const [platformFees, setPlatformFees] = useState(null);

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const data = response.data.data;

        // Map and sort API data for no_of_people
        const sortedRows = data.no_of_people
          .sort((a, b) => a.people_count - b.people_count)
          .map((item) => ({
            id: item.id,
            count: item.people_count,
            price: item.base_price,
            duration: item.aprox_time,
          }));
        setGuestRows(sortedRows);

        // Extract and map dishes
        const dishes = data.dishes.map((dish) => ({
          id: dish.dish_id,
          dishName: dish.dish_name, // Ensure `dishName` matches your state key
        }));
        setMenuRows(dishes); // Set dishes in `menuRows`

        // Other fields
        setStartTime(data.service_start_time.slice(0, 5));
        setEndTime(data.service_end_time.slice(0, 5));
        setNightChargesStartAt(data.night_charge_start_time.slice(0, 5));
        setNightChargesEndAt(data.night_charge_end_time.slice(0, 5));
        setBookBefore(data.booking_time_before);
        setCancellationBefore(data.booking_time_before);
        setFreeCancellationBefore(data.free_cancellation_time_before);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setNightCharge(data.night_charge || "");


        setGst(data.gst || null);
setSecureFees(data.secure_fee || null);
setPlatformFees(data.platform_fee || null);
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

  const [menuRows, setMenuRows] = useState([{ id: 0, dishName: "" }]);

  const handleAddMenuRow = () => {
    const newMenuRow = {
      id: menuRows.length,
      dishName: "",
    };
    setMenuRows([...menuRows, newMenuRow]);
  };

  const handleRemoveMenuRow = (id) => {
    if (menuRows.length === 1) {
      toast.error("At least one menu item is required.");
      return;
    }

    // Remove the dish from the menuRows array
    const updatedMenuRows = menuRows
      .filter((row) => row.id !== id)
      .map((row, index) => ({
        ...row,
        id: index, // Reassign IDs based on the new array index
      }));

    setMenuRows(updatedMenuRows);
  };

  const handleDishNameChange = (index, value) => {
    const updatedMenuRows = [...menuRows];
    updatedMenuRows[index].dishName = value;
    setMenuRows(updatedMenuRows);
  };

  const handleMenuChange = (item) => {
    setSelectedMenuItems((prev) =>
      prev.includes(item)
        ? prev.filter((menuItem) => menuItem !== item)
        : [...prev, item]
    );
  };

  const handleAddRow = () => {
    if (guestRows.length >= 15) {
      toast.error("Guest count cannot exceed 15.");
      return;
    }
    const newRow = {
      id: guestRows.length, // Use length as the ID for simplicity
      count: guestRows.length + 1, // Increment count based on the number of rows
      duration: "",
      price: "",
    };
    setGuestRows([...guestRows, newRow]);
  };

  const handleRemoveRow = (id) => {
    if (guestRows.length > 1) {
      setGuestRows(guestRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one guest slot is required.");
    }
  };

  const handleCountChange = (index, increment) => {
    if (index === 0) {
      toast.error("Cannot change the guest count for the first row.");
      return;
    }

    const updatedRows = [...guestRows];
    updatedRows[index].count = increment
      ? updatedRows[index].count + 1
      : Math.max(updatedRows[index].count - 1, 1); // Minimum count of 1
    setGuestRows(updatedRows);
  };

  const handleDurationChange = (index, value) => {
    const newRows = [...guestRows];
    newRows[index].duration = value;
    setGuestRows(newRows);
  };

  const handlePriceChange = (index, value) => {
    const newRows = [...guestRows];
    newRows[index].price = value;
    setGuestRows(newRows);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
    // Validate that all dish names are filled
    const invalidMenuItem = menuRows.some(row => !row.dishName.trim());
    if (invalidMenuItem) {
      toast.error("Please fill out all dish names before submitting.");
      return; // Prevent form submission if validation fails
    }
  
    // Validate that all guest count and price fields are filled
    const invalidGuestRow = guestRows.some(
      (row) => !row.count || row.count < 1 || !row.price || row.price <= 0
    );
    if (invalidGuestRow) {
      toast.error("Please fill out all guest counts and prices before submitting.");
      return; // Prevent form submission if validation fails
    }
  
    // Validate that guest counts are unique
    const guestCounts = guestRows.map(row => row.count);
    const hasDuplicateGuestCounts = guestCounts.length !== new Set(guestCounts).size;
    if (hasDuplicateGuestCounts) {
      toast.error("Guest counts should be unique. Please add different guest counts.");
      return;
    }
  
    // Validate that guest counts are in ascending order
    const isAscendingOrder = guestCounts.every((count, index, array) =>
      index === 0 || count >= array[index - 1]
    );
    if (!isAscendingOrder) {
      toast.error("Guest counts should be in ascending order.");
      return;
    }
  
    // Validate that the number of rows does not exceed 15
    if (guestRows.length > 15) {
      toast.error("Guest count cannot exceed 15.");
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
  
    // Add required fields
    formData.append("category_id", 1); // Add category_id explicitly
    formData.append("sub_category_id", 1); // Add sub_category_id explicitly
    formData.append("service_start_time", startTime);
    formData.append("service_end_time", endTime);
    formData.append("night_charge_start_time", nightChargesStartAt);
    formData.append("night_charge_end_time", nightChargesEndAt);
    formData.append("booking_time_before", bookBefore);
    formData.append("cancellation_time_before", cancellationBefore);
    formData.append("free_cancellation_time_before", freeCancellationBefore);
    formData.append("cancellation_policy", cancellationPolicy);
    formData.append("booking_summary", bookingSummaryPage);
    formData.append("booking_details", summary);
    formData.append("night_charge", night_charge || "");

    formData.append("gst", gst || "");
    formData.append("secure_fee", secureFees || "");
    formData.append("platform_fee", platformFees || "");
  
  
    // Add `no_of_people` data
    const noOfPeopleData = guestRows.map((row) => ({
      people_count: row.count,
      base_price: row.price,
      aprox_time: row.duration,
    }));
    formData.append("no_of_people", JSON.stringify(noOfPeopleData));
  
    // Add `dishes` data
    const menuItemsData = menuRows.map((row) => ({
      dish_name: row.dishName,
    }));
    formData.append("dishes", JSON.stringify(menuItemsData));
  
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

  const timeOptions = generateTimeOptions();

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Cook for One Meal</h3>
      <form onSubmit={handleSubmit}>
        {/* Start Time, End Time, Night Charges Start At */}
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
              value={freeCancellationBefore} // Set value to empty string when null
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
              value={night_charge === null ? "" : night_charge} // Set value to empty string when null
              onChange={(e) =>
                setNightCharge(
                  e.target.value === "" ? null : Number(e.target.value) // Correct state update
                )
              }
              required
            />
          </div>

          
        </div>



        <div className="row mb-3 align-items-center">
  <div className="col-md-3">
    <label htmlFor="gst" className="form-label">GST</label>
    <input
      type="number"
      className="form-control"
      id="gst"
      value={gst === null ? "" : gst} // Set value to empty string when null
      onChange={(e) => setGst(e.target.value === "" ? null : Number(e.target.value))}
      min="1"
      required
    />
  </div>
  <div className="col-md-3">
    <label htmlFor="secureFees" className="form-label">Secure Fees</label>
    <input
      type="number"
      className="form-control"
      id="secureFees"
      value={secureFees === null ? "" : secureFees} // Set value to empty string when null
      onChange={(e) => setSecureFees(e.target.value === "" ? null : Number(e.target.value))}
      min="1"
      required
    />
  </div>
  <div className="col-md-3">
    <label htmlFor="platformFees" className="form-label">Platform Fees</label>
    <input
      type="number"
      className="form-control"
      id="platformFees"
      value={platformFees === null ? "" : platformFees} // Set value to empty string when null
      onChange={(e) => setPlatformFees(e.target.value === "" ? null : Number(e.target.value))}
      min="1"
      required
    />
  </div>
</div>




        
        {/* Guest Time Slot Section */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">
            Time duration and price as per guest count
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            {guestRows.map((row, index) => (
              <div
                key={row.id}
                className="row mb-3"
                style={{
                  backgroundColor: "#F6F8F9",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    COUNT OF GUESTS <span className="text-danger">*</span>
                  </div>
                  <div className="component-guest2">
                    {row.count}
                    {index !== 0 && ( // Prevent count modification for the first row
                      <div className="innerSvg_AddTable">
                        <BiMinus
                          className="SubinnerSvg"
                          onClick={() => handleCountChange(index, false)}
                          disabled={row.count <= 1}
                        />
                        <HiPlusSmall
                          className="SubinnerSvg"
                          onClick={() => handleCountChange(index, true)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-3 p-4">
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

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION (in minutes) <span className="text-danger">*</span>
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
                        placeholder="Enter duration in minutes"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="col-12 col-md-2 p-4 mt-4 d-flex align-items-center"
                  style={{ justifyContent: "space-evenly" }}
                >
                  {index === guestRows.length - 1 && (
                    <HiPlus
                      className="svg_AddTable"
                      style={{ fontSize: "25px" }}
                      onClick={handleAddRow}
                    />
                  )}
                  {index !== 0 && ( // Prevent removal of the first row
                    <IoMdBackspace
                      className="svg_AddTable"
                      onClick={() => handleRemoveRow(row.id)}
                      style={{ marginRight: "10px", fontSize: "25px" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Menu Section */}

        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">Menu Items</p>
          <div
            className="menu-container"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {menuRows.map((row, index) => (
              <div
                key={row.id}
                className="menu-row"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F6F8F9",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Dish Name Input */}
                <div style={{ flex: 1, marginRight: "15px" }}>
                  <label
                    className="Subheading2_AddTable"
                    style={{ fontWeight: "600" }}
                  >
                    Dish Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={row.dishName}
                    onChange={(e) =>
                      handleDishNameChange(index, e.target.value)
                    }
                    className="form-control"
                    placeholder="Enter dish name"
                    required
                    style={{
                      marginTop: "5px",
                      padding: "8px",
                      fontSize: "18px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div
                  className="menu-actions mt-4"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* Add Button */}
                  {index === menuRows.length - 1 && (
                    <HiPlus
                      className="svg_AddTable"
                      style={{
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                      onClick={handleAddMenuRow}
                    />
                  )}

                  {/* Remove Button */}
                  {menuRows.length > 1 && (
                    <IoMdBackspace
                      className="svg_AddTable"
                      style={{
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemoveMenuRow(row.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>





        

        {/* Summernote or Quill Editor for Editable Summary */}
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

export default OneMealTab;
