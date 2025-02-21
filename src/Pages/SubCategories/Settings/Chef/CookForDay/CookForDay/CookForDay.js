import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { HiPlusSmall } from "react-icons/hi2";
import { IoMdBackspace } from "react-icons/io";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";

const CookForDay = () => {
  const [partnerTax, setPartnerTax] = useState(null);
  const [commission, setCommission] = useState(null);
  const [partnersPayPercentage, setPartnersPayPercentage] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [nightChargesEndAt, setNightChargesEndAt] = useState(""); // New Field
  const [bookBefore, setBookBefore] = useState(1);
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1); // New Field
  const [summary, setSummary] = useState("");
  const [nightCharge, setNightCharge] = useState([]);
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState(null);
  // const [guestRows, setGuestRows] = useState([
  //   { id: 0, count: 1, duration: "", price: "" },
  // ]);

  const [guestRows, setGuestRows] = useState([
    { id: 0, count: 1, duration: "720", price: "" },
  ]);
  const [menuRows, setMenuRows] = useState([{ id: 0, dishName: "" }]);

  const [gst, setGst] = useState(null);
  const [secureFees, setSecureFees] = useState(null);
  const [platformFees, setPlatformFees] = useState(null);

  const handleCommissionChange = (e) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setCommission(value);
    setPartnersPayPercentage(value !== null ? 100 - value : null);
  };
  // Fetch data for sub_category_id = 2

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/2`,
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

        const dishes = data.dishes
          .filter((dish) => dish.dish_name.trim() !== "")
          .map((dish) => ({
            id: dish.dish_id,
            dishName: dish.dish_name,
          }))
          .sort((a, b) => a.id - b.id);

        setMenuRows(dishes);

        setStartTime(data.service_start_time.slice(0, 5));
        setEndTime(data.service_end_time.slice(0, 5));
        setNightChargesStartAt(data.night_charge_start_time.slice(0, 5));
        setNightChargesEndAt(data.night_charge_end_time.slice(0, 5));
        setBookBefore(data.booking_time_before || 1);
        setCancellationBefore(data.cancellation_time_before || 1);
        setFreeCancellationBefore(data.free_cancellation_time_before || 1);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setNightCharge(data.night_charge || "");

        setGst(data.gst);
        setSecureFees(data.secure_fee || null);
        setPlatformFees(data.platform_fee || null);

        setPartnerTax(data.partner_tax);
        setCommission(data.commission || null);
        setPartnersPayPercentage(
          data.commission !== null ? 100 - data.commission : null
        );

        // Populate guestRows based on API response (if provided)
        if (data.no_of_people && data.no_of_people.length > 0) {
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

  // const handleAddRow = () => {
  //   // Get the count of the last row, default to 1 if it's the first row
  //   const lastCount =
  //     guestRows.length > 0 ? guestRows[guestRows.length - 1].count : 0;

  //   // Check if the new count exceeds the max limit
  //   if (lastCount >= 15) {
  //     toast.error("Guest count cannot exceed 15.");
  //     return;
  //   }

  //   // Add the new row with incremented count
  //   setGuestRows([
  //     ...guestRows,
  //     { id: guestRows.length, count: lastCount + 1, duration: "", price: "" },
  //   ]);
  // };

  // const handleAddRow = () => {
  //   // Get the count of the last row, default to 1 if it's the first row
  //   const lastCount =
  //     guestRows.length > 0 ? guestRows[guestRows.length - 1].count : 0;

  //   // Check if the new count exceeds the max limit
  //   if (lastCount >= 15) {
  //     toast.error("Guest count cannot exceed 15.");
  //     return;
  //   }

  //   // Add the new row with incremented count and default duration of "720"
  //   setGuestRows([
  //     ...guestRows,
  //     {
  //       id: guestRows.length,
  //       count: lastCount + 1,
  //       duration: "720",
  //       price: "",
  //     }, // Default duration set to "720"
  //   ]);
  // };


  const handleAddRow = () => {
    // Get the count of the last row, default to 1 if it's the first row
    const lastCount = guestRows.length > 0 ? guestRows[guestRows.length - 1].count : 0;
  
    // Remove guest count limit of 15
    setGuestRows([
      ...guestRows,
      {
        id: guestRows.length,
        count: lastCount + 1,
        duration: "720",
        price: "",
      },
    ]);
  };
  
  const handleRemoveRow = (id) => {
    if (guestRows.length > 1) {
      setGuestRows(guestRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one guest slot is required.");
    }
  };

  const handleCountChange = (index, increment) => {
    const newRows = [...guestRows];

    // Check if the count exceeds the maximum limit
    if (increment && newRows[index].count >= 15) {
      toast.error("Guest count cannot exceed 15.");
      return;
    }

    // Update count
    newRows[index].count = increment
      ? newRows[index].count + 1
      : Math.max(newRows[index].count - 1, 1); // Prevent count from going below 1

    setGuestRows(newRows);
  };

  // const handleDurationChange = (index, value) => {
  //   const newRows = [...guestRows];
  //   newRows[index].duration = value;
  //   setGuestRows(newRows);
  // };

  const handleDurationChange = (index, value) => {
    const updatedRows = [...guestRows];
    updatedRows[index].duration = value;
    setGuestRows(updatedRows);
  };

  const handlePriceChange = (index, value) => {
    const newRows = [...guestRows];
    newRows[index].price = value;
    setGuestRows(newRows);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    // Create FormData object
    const formData = new FormData();

    const invalidMenuItem = menuRows.some((row) => !row.dishName.trim());
    if (invalidMenuItem) {
      toast.error("Please fill out all dish names before submitting.");
      return; // Prevent form submission if validation fails
    }

    // Validate that all guest count and price fields are filled
    const invalidGuestRow = guestRows.some(
      (row) => !row.count || row.count < 1 || !row.price || row.price <= 0
    );
    if (invalidGuestRow) {
      toast.error(
        "Please fill out all guest counts and prices before submitting."
      );
      return; // Prevent form submission if validation fails
    }

    const guestCounts = guestRows.map((row) => row.count);
    const hasDuplicateGuestCounts =
      guestCounts.length !== new Set(guestCounts).size;
    if (hasDuplicateGuestCounts) {
      toast.error(
        "Guest counts should be unique. Please add different guest counts."
      );
      return;
    }

    // Validate that guest counts are in ascending order
    const isAscendingOrder = guestCounts.every(
      (count, index, array) => index === 0 || count >= array[index - 1]
    );
    if (!isAscendingOrder) {
      toast.error("Guest counts should be in ascending order.");
      return;
    }

    // Validate that the number of rows does not exceed 15
    // if (guestRows.length > 15) {
    //   toast.error("Guest count cannot exceed 15.");
    //   return;
    // }

    // Add required fields
    formData.append("category_id", 1); // Add category_id explicitly
    formData.append("sub_category_id", 2); // Add sub_category_id explicitly
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
    formData.append("night_charge", nightCharge ?? "");
    formData.append("duration", "720 minutes");

    formData.append("gst", gst ?? "0");
    formData.append("partner_tax", partnerTax ?? "0");
    formData.append("secure_fee", secureFees ?? "");
    formData.append("platform_fee", platformFees ?? "");
    formData.append("commission", commission || "");

    // Add `no_of_people` data
    // const noOfPeopleData = guestRows.map((row) => ({
    //   people_count: row.count,
    //   base_price: row.price,
    //   aprox_time: "720",
    // }));
    // formData.append("no_of_people", JSON.stringify(noOfPeopleData));

    const noOfPeopleData = guestRows.map((row) => ({
      people_count: row.count,
      base_price: row.price,
      aprox_time: row.duration, // Now storing user-modified duration
    }));
    formData.append("no_of_people", JSON.stringify(noOfPeopleData));

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

  const handleAddMenuRow = () => {
    // Create a new row with an empty dishName
    const newRow = { id: Date.now(), dishName: "" };
    setMenuRows([...menuRows, newRow]);
  };

  const handleDishNameChange = (index, value) => {
    // Update the dishName of the specific row based on the index
    const updatedMenuRows = [...menuRows];
    updatedMenuRows[index].dishName = value;
    setMenuRows(updatedMenuRows);
  };
  const timeOptions = generateTimeOptions();
  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Cook for One day</h3>
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
              value={nightCharge ?? ""} // Set value to empty string when null
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
  <label htmlFor="gst" className="form-label">Tax on commission & Platform Fee</label>
  <input
    type="number"
    className="form-control"
    id="gst"
    value={gst === null ? "" : gst}
    onChange={(e) => {
      let value = e.target.value === "" ? null : Number(e.target.value);
      setGst(value);
    }}
    min="0"
    required
  />
</div>
          {/* <div className="col-md-3">
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
  </div> */}

<div className="col-md-3">
  <label htmlFor="partnerTax" className="form-label">Tax on Partner's Pay</label>
  <input
    type="number"
    className="form-control"
    id="partnerTax"
    value={partnerTax === null ? "" : partnerTax}
    onChange={(e) => {
      let value = e.target.value === "" ? null : Number(e.target.value);
      setPartnerTax(value);
    }}
    min="0"
    required
  />
</div>

          <div className="col-md-3">
            <label htmlFor="commission" className="form-label">
              Servyo Commission %
            </label>
            <input
              type="number"
              className="form-control"
              id="commission"
              value={commission === null ? "" : commission}
              onChange={handleCommissionChange}
              min="1"
              max="100"
              required
            />
          </div>

          {/* Partner's Pay Percentage (Automatically calculated) */}
          <div className="col-md-3">
            <label htmlFor="partnersPay" className="form-label">
              Partner's Commission %
            </label>
            <input
              type="number"
              className="form-control"
              id="partnersPay"
              value={
                partnersPayPercentage === null ? "" : partnersPayPercentage
              }
              disabled // Prevents manual editing
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
              value={platformFees ?? ""} // Set value to empty string when null
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

                {/* <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION (Fixed: 12 hours)
                  </div>
                  <div className="seating_AddTable">
                    <div className="component-guest1">
                      <input
                        type="text"
                        value="720 minutes"
                        className="form-control"
                        readOnly
                      />
                    </div>
                  </div>
                </div> */}

                {/* <div className="col-12 col-md-3 p-4">
  <div className="Subheading2_AddTable">
    DURATION (Fixed: 12 hours)
  </div>
  <div className="seating_AddTable">
    <div className="component-guest1">
      <input
        type="text"
        value="720 minutes"  // Fixed value
        className="form-control"
        readOnly  // Prevents user from editing
        disabled  // Further ensures it's non-editable
      />
    </div>
  </div>
</div> */}

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION In Minutes
                     {/* (Fixed:12hr) */}
                  </div>
                  <div className="seating_AddTable">
                    <div className="component-guest1">
                      <input
                        type="number"
                        value={row.duration}
                        onChange={(e) =>
                          handleDurationChange(index, e.target.value)
                        }
                        className="form-control"
                        placeholder="Enter duration in minutes"
                        min="0"
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
                  <IoMdBackspace
                    className="svg_AddTable"
                    onClick={() => handleRemoveRow(row.id)}
                    style={{ marginRight: "10px", fontSize: "25px" }}
                  />
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
            {/* If there are no rows, show one input field */}
            {menuRows.length === 0 && (
              <div
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
                    value={menuRows[0]?.dishName || ""} // Ensure the value is properly linked to the first row
                    onChange={
                      (e) => handleDishNameChange(0, e.target.value) // Use index 0 for the first (and only) row
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
                {/* Add Button */}
                <div
                  className="menu-actions mt-4"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <HiPlus
                    className="svg_AddTable"
                    style={{
                      fontSize: "25px",
                      cursor: "pointer",
                    }}
                    onClick={handleAddMenuRow} // Add new row when + button is clicked
                  />
                </div>
              </div>
            )}

            {/* If there are existing rows, display them */}
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
                    value={row.dishName || ""} // Ensure value is only linked to the specific row
                    onChange={
                      (e) => handleDishNameChange(index, e.target.value) // Update only the dishName of the row being typed in
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
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {/* Add Button */}
                  {index === menuRows.length - 1 && (
                    <HiPlus
                      className="svg_AddTable"
                      style={{
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                      onClick={handleAddMenuRow} // Add new row when + button is clicked
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
                      onClick={() => handleRemoveMenuRow(row.id)} // Logic to remove a row
                    />
                  )}
                </div>
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

export default CookForDay;
