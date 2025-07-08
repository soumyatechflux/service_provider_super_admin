// import { PDFDownloadLink } from '@react-pdf/renderer';
// import axios from "axios";
// import { format } from "date-fns";
// import React, { useEffect, useState } from "react";
// import { FaPeopleArrows } from "react-icons/fa";
// import { TbFileInvoice } from "react-icons/tb";
// import { toast } from "react-toastify";
// import CustomerInvoiceDocument from "../../../Invoice/CustomerInvoiceDocument/CustomerInvoiceDocument";
// import PartnerInvoiceDocument from "../../../Invoice/PartnerInvoiceDocument/PartnerInvoiceDocument";
// import Loader from "../../../Loader/Loader";
// import ReassignPartnerModal from "../../ReassignPartnerModal/ReassignPartnerModal";
// import AttachmentModal from "./AttachmentModal/AttachmentModal";
// import EditStatusModal from "./EditStatusModal/EditStatusModal";
// import PriceDetailModal from "./PriceDetailModal/PriceDetailModal";
// import GardenerSlotsModal from './GardenerSlotsModal/GardenerSlotsModal';

// const CommonBookingTab = ({ category_id, loading, setLoading }) => {
//   function formatDateWithTime(dateString) {
//     const date = new Date(dateString);

//     // Check if the date is valid
//     if (isNaN(date.getTime())) {
//       return "N/A";
//     }

//     // Date format (Day Month Year)
//     const formattedDate = new Intl.DateTimeFormat("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }).format(date);

//     // Time format (AM/PM)
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";

//     // Convert to 12-hour format
//     hours = hours % 12;
//     hours = hours ? hours : 12; // 12 AM/PM instead of 0
//     minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes if necessary

//     const formattedTime = `${hours}:${minutes} ${ampm}`;

//     return `${formattedDate}, ${formattedTime}`;
//   }

//   const formatPaymentMode = (mode) => {
//     if (!mode) return "N/A"; // Handle null/undefined
//     if (mode.toLowerCase() === "online") return "Online";
//     if (mode.toLowerCase() === "cod") return "COD";
//     return mode.charAt(0).toUpperCase() + mode.slice(1); // Default behavior
//   };
//   const [dummy_Data, setDummy_Data] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [selectedBookingStatus, setSelectedBookingStatus] = useState(null);
//   const [partnerId, setPartnerId] = useState(null);
//   const [categoryId, setCategoryId] = useState(null);
//   const [showAttachmentModal, setShowAttachmentModal] = useState(false);
//   const [attachmentsData, setAttachmentsData] = useState({});
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [showReassignModal, setShowReassignModal] = useState(false);
// const [selectedBooking, setSelectedBooking] = useState(null);
// const [showGardenerSlotsModal, setShowGardenerSlotsModal] = useState(false);
// const [selectedGardenerSlots, setSelectedGardenerSlots] = useState([]);
// const [selectedBookingCompleteDates, setSelectedBookingCompleteDates] = useState([]);


//   const entriesPerPage = 10;

//   const handleSearch = () => {
//     getCommissionData();
//   };
  
//   const handleRemoveFilter = () => {
//     setFromDate("");
//     setToDate("");
//     getCommissionData();
//   };
  
//   const getCommissionData = async () => {
//     try {
//       const token = sessionStorage.getItem(
//         "TokenForSuperAdminOfServiceProvider"
//       );
//       setLoading(true);
  
//       const params = {
//         category_id: category_id,
//       };
  
//       if (fromDate) params.from_date = fromDate;
//       if (toDate) params.to_date = toDate;
  
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           params,
//         }
//       );
  
//       setLoading(false);
  
//       if (response?.status === 200 && response?.data?.success) {
//         const data = response?.data?.data || [];
//         const filteredData = data.filter(
//           (item) => item.category_id === parseInt(category_id, 10)
//         );
//         setDummy_Data(filteredData);
//       } else {
//         toast.error(response.data.message || "Failed to fetch bookings.");
//       }
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       toast.error("Failed to load bookings. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getCommissionData();
//   }, [category_id]);
  

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   }, [currentPage]);

//   const handleOpenEditModal = (
//     bookingId,
//     bookingStatus,
//     partnerId,
//     categoryId
//   ) => {
//     setSelectedBookingId(bookingId);
//     setSelectedBookingStatus(bookingStatus);
//     setPartnerId(partnerId);
//     setCategoryId(categoryId);
//     setShowEditModal(true);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleOpenAttachmentModal = (attachments) => {
//     setAttachmentsData(attachments);
//     setShowAttachmentModal(true);
//   };

//   const handleCloseAttachmentModal = () => {
//     setShowAttachmentModal(false);
//   };

//   const handleOpenGardenerSlotsModal = (slots, completeDates) => {
//     setSelectedGardenerSlots(slots || []);
//     setSelectedBookingCompleteDates(completeDates || []);
//     setShowGardenerSlotsModal(true);
//   };
//   // const totalPages = Math.ceil(filteredData.length / entriesPerPage);
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

//   const normalizeString = (str) =>
//     str?.replace(/\s+/g, " ").trim().toLowerCase() || "";
  
//   const normalizeNumber = (num) => (isNaN(num) ? "" : Number(num)); // Convert to number or empty string
  
//   // Function to safely parse `dishes` if it's a stringified array
//   const parseDishes = (dishes) => {
//     if (!dishes) return "N/A";
//     if (typeof dishes === "string") {
//       try {
//         const parsed = JSON.parse(dishes);
//         return Array.isArray(parsed) && parsed.length > 0 ? parsed.join(", ") : "N/A";
//       } catch (error) {
//         return "N/A"; // If JSON parsing fails, return "N/A"
//       }
//     }
//     return Array.isArray(dishes) && dishes.length > 0 ? dishes.join(", ") : "N/A";
//   };
  
//   // Function to format date in "DD MMM YY, h:mm A" format
//   const formatDateTime = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "2-digit",
//       hour: "numeric",
//       minute: "numeric",
//       hour12: true,
//     }).format(date);
//   };
  
//   const filteredData = dummy_Data.filter((item) => {
//     const searchTerm = normalizeString(searchInput);
//     const searchTermNumber = normalizeNumber(searchInput); // Convert input to a number if possible
//     const normalizedDishes = normalizeString(item?.dishes ?? "");
    
//     const gardenerDates = (item.gardener_visiting_slots || [])
//     .map((slot) => normalizeString(format(new Date(slot.date), "dd MMM yyyy")))
//     .join(" "); // Convert array to a searchable string

  
//     return (
//       normalizeString(item?.guest_name ?? "").includes(searchTerm) || // Customer name
//       normalizeString(String(item?.booking_id ?? "")).includes(searchTerm) || // Booking ID
//       normalizeString(item?.partner?.name ?? "").includes(searchTerm) || // Partner name
//       normalizeString(item?.sub_category_name?.sub_category_name ?? "").includes(searchTerm) || // Sub-category
//       normalizeString(String(item?.total_amount ?? "")).includes(searchTerm) || // Amount
//       normalizeString(item?.visit_address ?? "").includes(searchTerm) || // Visited Address
//       normalizeString(item?.payment_mode ?? "").includes(searchTerm) || // Payment Mode
//       normalizeString(item?.booking_status ?? "").includes(searchTerm) || // Booking Status
//       normalizeString(item?.instructions ?? "").includes(searchTerm) || // Instructions
//       normalizeNumber(item?.billing_amount) === searchTermNumber || // Billing Amount as a number
//       normalizeString(formatDateTime(item?.visit_date)).includes(searchTerm) || // Visit Date formatted
//       normalizeString(formatDateTime(item?.created_at)).includes(searchTerm) || // Created Date formatted
//       normalizeString(formatDateTime(item?.reached_location)).includes(searchTerm) || // Reached Location formatted
//       normalizeString(formatDateTime(item?.start_job)).includes(searchTerm) || // Start Job formatted
//       normalizeString(formatDateTime(item?.end_job)).includes(searchTerm) || // End Job formatted
//       normalizeString(formatDateTime(item?.payment)).includes(searchTerm) || // Payment formatted
//       normalizeString(item?.car_type ?? "").includes(searchTerm) || // Car Type
//       normalizeString(item?.transmission_type ?? "").includes(searchTerm) || // Transmission Type
//       normalizeNumber(item?.people_count) === searchTermNumber || // People Count as number
//       normalizeNumber(item?.no_of_hours_booked) === searchTermNumber ||
//       normalizedDishes.includes(searchTerm) ||
//       normalizeString(item?.menu ?? "N/A").includes(searchTerm) || // Menu (handles null)
//       gardenerDates.includes(searchTerm)
//     );
//   });
  
  
//   const currentEntries = filteredData.slice(
//     indexOfFirstEntry,
//     indexOfLastEntry
//   );

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const [showPriceDetailModal, setShowPriceDetailModal] = useState(false);

//   const handleOpenPriceDetailModal = (booking) => {
//     setSelectedBooking(booking);
//     setShowPriceDetailModal(true);
//   };

//   const handleClosePriceDetailModal = () => {
//     setShowPriceDetailModal(false);
//   };

//   const renderPagination = () => {
//     if (filteredData.length <= entriesPerPage) return null;
  
//     const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  
//     // Determine the range of pages to display
//     const pageNumbers = [];
//     const pagesToShow = 3; // Number of page numbers to display at a time
//     let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
//     let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
//     // Adjust startPage if we are near the last pages
//     if (endPage - startPage < pagesToShow - 1) {
//       startPage = Math.max(1, endPage - pagesToShow + 1);
//     }
  
//     // Collect page numbers for display
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
  
//     return (
//       <nav>
//         <ul className="pagination justify-content-center" style={{ gap: "5px" }}>
//           {/* First Page Button */}
//           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               onClick={() => handlePageChange(1)}
//             >
//               First
//             </button>
//           </li>
  
//           {/* Previous Page Button */}
//           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               Previous
//             </button>
//           </li>
  
//           {/* Page Numbers */}
//           {pageNumbers.map((number) => (
//             <li
//               key={number}
//               className={`page-item ${currentPage === number ? "active" : ""}`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => handlePageChange(number)}
//               >
//                 {number}
//               </button>
//             </li>
//           ))}
  
//           {/* Next Page Button */}
//           <li
//             className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//           >
//             <button
//               className="page-link"
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               Next
//             </button>
//           </li>
  
//           {/* Last Page Button */}
//           <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               onClick={() => handlePageChange(totalPages)}
//             >
//               Last
//             </button>
//           </li>
//         </ul>
//       </nav>
//     );
//   };
  
//   const totalPages = Math.ceil(filteredData.length / entriesPerPage);

//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     }
//   }, [totalPages, currentPage]);

//   return (
//     <div className="SubCategory-Table-Main p-3">
//       <div className="d-flex justify-content-between align-items-center">
//         <h2>Bookings</h2>
//         <input
//         type="text"
//         className="form-control search-input w-25"
//         placeholder="Search by guest name..."
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//       />
//       </div>
//       <div className="d-flex justify-content-between align-items-center">
        
//   <p>From Date:</p>
//   <input
//     type="date"
//     className="form-control w-25"
//     value={fromDate}
//     onChange={(e) => setFromDate(e.target.value)}
//     max={toDate} // Ensures "From Date" is not after "To Date"
//   />
  
//   <p>To Date:</p>
//   <input
//     type="date"
//     className="form-control w-25"
//     value={toDate}
//     onChange={(e) => setToDate(e.target.value)}
//     min={fromDate} // Ensures "To Date" is not before "From Date"
//   />

//   <button className="btn btn-primary" style={{boxShadow:"none"}} onClick={handleSearch}>Search</button>
//   <button className="btn btn-secondary" style={{boxShadow:"none"}} onClick={handleRemoveFilter}>Remove Filter</button>
// </div>


//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <div className="table-responsive mb-5">
//             <table className="table table-bordered table-user">
//               <thead className="heading_user">
//                 <tr>
//                   <th scope="col" style={{ width: "5%" }}>
//                     Sr.
//                   </th>
//                   <th scope="col" style={{ width: "5%" }}>
//                     Booking Id
//                   </th>
//                   <th scope="col" style={{ width: "5%" }}>
//                     Partner Id
//                   </th>
//                   <th scope="col" style={{ width: "10%" }}>
//                     Customer Name
//                   </th>
//                   <th scope="col" style={{ width: "10%" }}>
//                     Customer Phone No
//                   </th>
//                   <th scope="col" style={{ width: "10%" }}>
//                     Partner Name
//                   </th>
//                   <th scope="col" style={{ width: "10%" }}>
//                     Sub Category
//                   </th>
//                   <th scope="col" style={{ width: "10%" }}>
//                     Status
//                   </th>
//                   {category_id === "1" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Menu
//                     </th>
//                   )}
//                   {category_id === "1" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Dishes
//                     </th>
//                   )}
//                    {category_id === "2" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Car Type
//                     </th>
//                   )}
//                   {category_id === "2" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                      Transmission Type
//                     </th>
//                   )}
                  
//                   {(category_id === "1" || category_id === "2") && (
//                     <th scope="col" style={{ width: "15%" }}>
//                       {category_id === "1" ? "No of People" : "No of Hours"}
//                     </th>
//                   )}
                  
//                   <th scope="col" style={{ width: "5%" }}>
//                     Amount
//                   </th>
//                   {(category_id === "1" || category_id === "3") && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Address
//                     </th>
//                   )}

//                   {category_id === "2" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Address From
//                     </th>
//                   )}
//                   {category_id === "2" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Address To
//                     </th>
//                   )}
//                   <th scope="col" style={{ width: "15%" }}>
//                     Visit Date
//                   </th>
//                   <th scope="col" style={{ width: "15%" }}>
//                     Booking Date
//                   </th>
                 
//                   {category_id !== "3" && (
//                   <th scope="col" style={{ width: "15%" }}>
//                     Partner Reached Time
//                   </th>
//                   )}
//                   {category_id !== "3" && (
//                   <th scope="col" style={{ width: "15%" }}>
//                     Booking Start Time
//                   </th>
//                   )}
//                   {category_id !== "3" && (
//                   <th scope="col" style={{ width: "15%" }}>
//                     Booking End Time
//                   </th>
//                   )}
//                    {category_id !== "3" && (
//                   <th scope="col" style={{ width: "15%" }}>
//                     Payment Time
//                   </th>
//                    )}

//                   <th scope="col" style={{ width: "10%" }}>
//                     Payment Mode
//                   </th>
//                   {category_id === "3" && (
//                     <th scope="col" style={{ width: "10%" }}>
//                       Visit Slot Count
//                     </th>
//                   )}
//                    {category_id === "3" && (
//                     <th scope="col" style={{ width: "25%" }}>
//                       Gardner Visit Dates
//                     </th>
//                   )}
//                    {category_id === "3" && (
//                   <th scope="col" style={{ width: "15%" }}>
//                     Service Slots
//                   </th>)}
//                   {category_id !== "1" && ( <th scope="col" style={{ width: "10%" }}> Hours Booked </th>)}
//                   <th scope="col" style={{ width: "10%" }}>
//                     Special Request
//                   </th>
//                   <th scope="col" style={{ width: "10%" }}>
//                     Attachments
//                   </th>
//                   {/* <th scope="col" style={{ width: "10%" }}>
//                     Status
//                   </th> */}
//                   <th scope="col" style={{ width: "5%" }}>
//                     Action
//                   </th>
//                   <th scope="col" style={{ width: "5%" }}>
//                     Partner Reassign
//                   </th>
//                   <th scope="col" style={{width:"13%"}}>Customer Invoice</th>
//                   <th scope="col" style={{width:"12%"}}>Partner Invoice</th>
//                 </tr>
//               </thead>
//               <tbody>
//   {currentEntries.length > 0 ? (
//     currentEntries.map((item, index) => (
//       <tr key={item.booking_id}>
//         <th scope="row">{indexOfFirstEntry + index + 1}.</th>
//         <td>{item.booking_id || "N/A"}</td>
//         <td>{item?.partner?.uid || "N/A"}</td>
//         <td>{item.guest_name || "N/A"}</td>
//         <td>{item?.customer?.mobile || "N/A"}</td>
//         <td>{item.partner?.name || "Not assigned yet"}</td>
//         <td>{item.sub_category_name?.sub_category_name || "Unknown"}</td>
//          <td
//   style={
//     item.booking_status === "not-started"
//       ? { backgroundColor: "#fff3cd", color: "#dc3545", fontWeight: "bold" }
//       : {}
//   }
// >
//   {item.booking_status
//     ? item.booking_status.charAt(0).toUpperCase() + item.booking_status.slice(1)
//     : "N/A"}
// </td>
//         {category_id === "1" && <td>{item.menu || "N/A"}</td>}
//         {category_id === "1" && (
//     <td>{item.dishes || "N/A"}</td>
// )}

//         {category_id === "2" && <td>{item.car_type || "N/A"}</td>}
//         {category_id === "2" && <td>{item.transmission_type || "N/A"}</td>}
//         {(category_id === "1" || category_id === "2") && (
//             <td>
//               {category_id === "1" 
//                 ? item.people_count || "N/A" 
//                 : item.no_of_hours_booked || "N/A"
//               }
//             </td>
//           )}
//         <td>
//           {item.billing_amount || "N/A"}
//           <i
//             className="fa fa-eye text-primary ml-2"
//             style={{ cursor: "pointer" }}
//             onClick={() => handleOpenPriceDetailModal(item)} // Open modal on click
//           />
//         </td>

//         {(category_id === "1" || category_id === "3") && (
//           <td>{item.visit_address || "No current_address available."}</td>
//         )}
//         {category_id === "2" && <td>{item.address_from || "No current_address available."}</td>}
//         {category_id === "2" && <td>{item.address_to || "No current_address available."}</td>}

//         <td>
//           {new Intl.DateTimeFormat("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "2-digit",
//           })
//             .format(new Date(item.visit_date))
//             .replace(",", "")},{" "}
//           {(() => {
//             const [hour, minute] = item.visit_time.split(":"); // Extract hour and minute
//             const date = new Date();
//             date.setHours(hour, minute); // Set extracted time

//             return date.toLocaleTimeString("en-US", {
//               hour: "numeric",
//               minute: "2-digit",
//               hour12: true, // Convert to 12-hour format
//             });
//           })()}
//         </td>

//         <td>{item.created_at ? formatDateWithTime(item.created_at) : "N/A"}</td>
        
//         {category_id !== "3" && (<td>{item.reached_location ? formatDateWithTime(item.reached_location) : "N/A"}</td>)}
//         {category_id !== "3" && (<td>{item.start_job ? formatDateWithTime(item.start_job) : "N/A"}</td>)}
//         {category_id !== "3" && (<td>{item.end_job ? formatDateWithTime(item.end_job) : "N/A"}</td>)}
//         {category_id !== "3" && (<td>{item.payment ? formatDateWithTime(item.payment) : "N/A"}</td>)}

//         <td>{formatPaymentMode(item.payment_mode)}</td>

//    {category_id == "3" && (
//   <td>
//     {item.sub_category_name?.sub_category_name === "One Time Visit" 
//       ? "1" 
//       : item.gardener_visiting_slot_count || "NA"}
//   </td>
// )}  
     
//  {category_id == "3" && (
//   <td style={{ width: "200px", whiteSpace: "nowrap" }}>
//     {item.sub_category_name?.sub_category_name === "One Time Visit"
//       ? format(new Date(item.visit_date), "dd MMM yyyy")
//       : item.gardener_visiting_slots?.length > 0
//         ? item.gardener_visiting_slots.map((slot, index) => (
//             <span key={index}>
//               {index + 1}. {format(new Date(slot.date), "dd MMM yyyy")}
//               <br />
//             </span>
//           ))
//         : "NA"}
//   </td>
// )}
// {category_id === "3" && (<td> <i className="fa fa-eye text-primary ml-2" style={{ cursor: "pointer" }}        onClick={() => handleOpenGardenerSlotsModal(
//         item.gardener_visiting_slots,  item.booking_complete_dates)} ></i></td>)}

//         {category_id !== "1" && <td>{item.no_of_hours_booked || "NA"}</td>}

//         <td>{item.instructions || "N/A"}</td>
//         <td>
//           {item.start_job_attachments.length > 0 || item.end_job_attachments.length > 0 ? (
//             <i
//               className="fa fa-eye text-primary"
//               style={{ cursor: "pointer" }}
//               onClick={() =>
//                 handleOpenAttachmentModal({
//                   start: item.start_job_attachments,
//                   end: item.end_job_attachments,
//                 })
//               }
//             />
//           ) : (
//             "No Attachments"
//           )}
//         </td>
//         {/* <td
//   style={
//     item.booking_status === "not-started"
//       ? { backgroundColor: "#fff3cd", color: "#dc3545", fontWeight: "bold" }
//       : {}
//   }
// >
//   {item.booking_status
//     ? item.booking_status.charAt(0).toUpperCase() + item.booking_status.slice(1)
//     : "N/A"}
// </td> */}

// <td>
//   <i
//     className={`fa fa-pencil-alt ${item.cancel_button ? "text-primary" : "text-muted"}`}
//     style={{
//       cursor: item.cancel_button ? "pointer" : "not-allowed",
//       opacity: item.cancel_button ? 1 : 0.5,
//     }}
//     onClick={() =>
//       item.cancel_button
//         ? handleOpenEditModal(item.booking_id, item.booking_status, item.partner_id, item.category_id)
//         : null
//     }
//   />
// </td>

// <td
//   style={{ textAlign: "center", cursor: "pointer" }}
//   onClick={() => {
//     setSelectedBooking(item);
//     setShowReassignModal(true);
//   }}
// >
//   <FaPeopleArrows />
// </td>   
// {/* <td style={{ textAlign: "center" }}>
//   <PDFDownloadLink
//     document={<CustomerInvoiceDocument customer={item} />}
//     fileName={`invoice-${item.booking_id}.pdf`}
//   >
//     {({ loading }) =>
//       loading ? 'Loading...' : (
//         <button className="payNow-btn">
//           Customer <TbFileInvoice />
//         </button>
//       )
//     }
//   </PDFDownloadLink>
// </td>


// <td style={{ textAlign: "center" }}>
//   <PDFDownloadLink
//     document={<PartnerInvoiceDocument customer={item} />}
//     fileName={`invoice-${item.booking_id}.pdf`}
//   >
//     {({ loading }) =>
//       loading ? 'Loading...' : (
//         <button className="payNow-btn">
//           Partner <TbFileInvoice />
//         </button>
//       )
//     }
//   </PDFDownloadLink>
// </td> */}

// {["completed", "cancelled"].includes(item.booking_status) ? (
//   <>
//     <td style={{ textAlign: "center" }}>
//       {item.booking_status === "cancelled" && item.cancel_charge_amount === 0 ? (
//         <button
//           className="payNow-btn"
//           style={{
//             backgroundColor: "#ccc",
//             color: "#666",
//             cursor: "not-allowed",
//           }}
//           disabled
//         >
//           Customer <TbFileInvoice />
//         </button>
//       ) : (
//         <PDFDownloadLink
//           document={<CustomerInvoiceDocument customer={item} />}
//           fileName={`Invoice-${item.booking_id}.pdf`}
//         >
//           {({ loading }) =>
//             loading ? (
//               "Loading..."
//             ) : (
//               <button className="payNow-btn">
//                 Customer <TbFileInvoice />
//               </button>
//             )
//           }
//         </PDFDownloadLink>
//       )}
//     </td>

//     <td style={{ textAlign: "center" }}>
//       {item.booking_status === "cancelled" ? (
//         <button
//           className="payNow-btn"
//           style={{
//             backgroundColor: "#ccc",
//             color: "#666",
//             cursor: "not-allowed",
//           }}
//           disabled
//         >
//           Partner <TbFileInvoice />
//         </button>
//       ) : (
//         <PDFDownloadLink
//           document={<PartnerInvoiceDocument customer={item} />}
//           fileName={`Invoice-${item.booking_id}.pdf`}
//         >
//           {({ loading }) =>
//             loading ? (
//               "Loading..."
//             ) : (
//               <button className="payNow-btn">
//                 Partner <TbFileInvoice />
//               </button>
//             )
//           }
//         </PDFDownloadLink>
//       )}
//     </td>
//   </>
// ) : (
//   <>
//     <td style={{ textAlign: "center" }}>
//       <button
//         className="payNow-btn"
//         style={{
//           backgroundColor: "#ccc",
//           color: "#666",
//           cursor: "not-allowed",
//         }}
//         disabled
//       >
//         Customer <TbFileInvoice />
//       </button>
//     </td>
//     <td style={{ textAlign: "center" }}>
//       <button
//         className="payNow-btn"
//         style={{
//           backgroundColor: "#ccc",
//           color: "#666",
//           cursor: "not-allowed",
//         }}
//         disabled
//       >
//         Partner <TbFileInvoice />
//       </button>
//     </td>
//   </>
// )}



//  </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="100%" className="text-center">
//         No data available
//       </td>
//     </tr>
//   )}
// </tbody>
//     </table>
//           </div>
//           {renderPagination()}
//         </>
//       )}

//       <AttachmentModal
//         open={showAttachmentModal}
//         attachments={attachmentsData}
//         onClose={handleCloseAttachmentModal}
//       />

// <PriceDetailModal
//         show={showPriceDetailModal}
//         onHide={handleClosePriceDetailModal}
//         bookingData={selectedBooking}
//       />

//       <EditStatusModal
//         open={showEditModal}
//         onClose={handleCloseEditModal}
//         bookingId={selectedBookingId}
//         partnerId={partnerId}
//         categoryId={categoryId}
//         getCommissionData={getCommissionData}
//         dummyData={dummy_Data}
//         setDummyData={setDummy_Data}
//         setShowEditModal={setShowEditModal}
//       />

//     <ReassignPartnerModal
//       show={showReassignModal}
//       onClose={() => setShowReassignModal(false)}
//       onSave={() => {}}
//       bookingData={selectedBooking}
//       getCommissionData={getCommissionData}
//     />
//     <GardenerSlotsModal
//   show={showGardenerSlotsModal}
//   onClose={() => setShowGardenerSlotsModal(false)}
//   slots={selectedGardenerSlots}
//   bookingCompleteDates={selectedBookingCompleteDates}
// />
//     </div>
//   );
// };

// export default CommonBookingTab;










import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaPeopleArrows } from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import { toast } from "react-toastify";
import CustomerInvoiceDocument from "../../../Invoice/CustomerInvoiceDocument/CustomerInvoiceDocument";
import PartnerInvoiceDocument from "../../../Invoice/PartnerInvoiceDocument/PartnerInvoiceDocument";
import Loader from "../../../Loader/Loader";
import ReassignPartnerModal from "../../ReassignPartnerModal/ReassignPartnerModal";
import AttachmentModal from "./AttachmentModal/AttachmentModal";
import EditStatusModal from "./EditStatusModal/EditStatusModal";
import PriceDetailModal from "./PriceDetailModal/PriceDetailModal";
import GardenerSlotsModal from './GardenerSlotsModal/GardenerSlotsModal';
import AttachmentModalPartner from '../../../NewSignUps/CommissionTable/AttachmentModalPartner/AttachmentModalPartner';
import CustomerInfoModal from '../../../Customers/CustomersTable/CustomerInfoModal/CustomerInfoModal';

const CommonBookingTab = ({ category_id, loading, setLoading }) => {
  function formatDateWithTime(dateString) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    // Date format (Day Month Year)
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);

    // Time format (AM/PM)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 AM/PM instead of 0
    minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes if necessary

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate}, ${formattedTime}`;
  }

  const formatPaymentMode = (mode) => {
    if (!mode) return "N/A"; // Handle null/undefined
    if (mode.toLowerCase() === "online") return "Online";
    if (mode.toLowerCase() === "cod") return "COD";
    return mode.charAt(0).toUpperCase() + mode.slice(1); // Default behavior
  };
  const [dummy_Data, setDummy_Data] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingStatus, setSelectedBookingStatus] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachmentsData, setAttachmentsData] = useState({});
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);
const [showGardenerSlotsModal, setShowGardenerSlotsModal] = useState(false);
const [selectedGardenerSlots, setSelectedGardenerSlots] = useState([]);
const [selectedBookingCompleteDates, setSelectedBookingCompleteDates] = useState([]);

const [showPartnerModal, setShowPartnerModal] = useState(false);
const [partnerData, setPartnerData] = useState(null);
const [partnerLoading, setPartnerLoading] = useState(false);

// const [showCustomerModal, setShowCustomerModal] = useState(false);
// const [selectedCustomer, setSelectedCustomer] = useState(null);
// const [customerLoading, setCustomerLoading] = useState(false);
const [showCustomerModal, setShowCustomerModal] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [customerLoading, setCustomerLoading] = useState(false);
const [loadingCustomerId, setLoadingCustomerId] = useState(null);

  const entriesPerPage = 10;

  const handleSearch = () => {
    getCommissionData();
  };
  
  const handleRemoveFilter = () => {
    setFromDate("");
    setToDate("");
    getCommissionData();
  };

  const fetchCustomerDetails = async (customerId) => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    const response = await axios.get(
      `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response?.status === 200 && response?.data?.success) {
      setSelectedCustomer(response.data.data);
      setShowCustomerModal(true);
    } else {
      toast.error(response.data.message || "Failed to fetch customer details.");
    }
  } catch (error) {
    console.error("Error fetching customer details:", error);
    toast.error("Failed to load customer details. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const fetchPartnerDetails = async (partnerId) => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    const response = await axios.get(
      `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/${partnerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response?.status === 200 && response?.data?.success) {
      setPartnerData(response.data.data);
      setShowPartnerModal(true);
    } else {
      toast.error(response.data.message || "Failed to fetch partner details.");
    }
  } catch (error) {
    console.error("Error fetching partner details:", error);
    toast.error("Failed to load partner details. Please try again.");
  } finally {
    setLoading(false);
  }
};
  
  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);
  
      const params = {
        category_id: category_id,
      };
  
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;
  
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );
  
      setLoading(false);
  
      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        const filteredData = data.filter(
          (item) => item.category_id === parseInt(category_id, 10)
        );
        setDummy_Data(filteredData);
      } else {
        toast.error(response.data.message || "Failed to fetch bookings.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommissionData();
  }, [category_id]);
  

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handleOpenEditModal = (
    bookingId,
    bookingStatus,
    partnerId,
    categoryId
  ) => {
    setSelectedBookingId(bookingId);
    setSelectedBookingStatus(bookingStatus);
    setPartnerId(partnerId);
    setCategoryId(categoryId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleOpenAttachmentModal = (attachments) => {
    setAttachmentsData(attachments);
    setShowAttachmentModal(true);
  };

  const handleCloseAttachmentModal = () => {
    setShowAttachmentModal(false);
  };

  const handleOpenGardenerSlotsModal = (slots, completeDates) => {
    setSelectedGardenerSlots(slots || []);
    setSelectedBookingCompleteDates(completeDates || []);
    setShowGardenerSlotsModal(true);
  };
  // const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const normalizeString = (str) =>
    str?.replace(/\s+/g, " ").trim().toLowerCase() || "";
  
  const normalizeNumber = (num) => (isNaN(num) ? "" : Number(num)); // Convert to number or empty string
  
  // Function to safely parse `dishes` if it's a stringified array
  const parseDishes = (dishes) => {
    if (!dishes) return "N/A";
    if (typeof dishes === "string") {
      try {
        const parsed = JSON.parse(dishes);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed.join(", ") : "N/A";
      } catch (error) {
        return "N/A"; // If JSON parsing fails, return "N/A"
      }
    }
    return Array.isArray(dishes) && dishes.length > 0 ? dishes.join(", ") : "N/A";
  };
  
  // Function to format date in "DD MMM YY, h:mm A" format
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };
  
  const filteredData = dummy_Data.filter((item) => {
    const searchTerm = normalizeString(searchInput);
    const searchTermNumber = normalizeNumber(searchInput); // Convert input to a number if possible
    const normalizedDishes = normalizeString(item?.dishes ?? "");
    
    const gardenerDates = (item.gardener_visiting_slots || [])
    .map((slot) => normalizeString(format(new Date(slot.date), "dd MMM yyyy")))
    .join(" "); // Convert array to a searchable string

  
    return (
      normalizeString(item?.guest_name ?? "").includes(searchTerm) || // Customer name
      normalizeString(String(item?.booking_id ?? "")).includes(searchTerm) || // Booking ID
      normalizeString(String(item?.partner?.uid  ?? "")).includes(searchTerm) ||
      normalizeString(String(item?.customer?.id ?? "")).includes(searchTerm) || 
      normalizeString(item?.partner?.name ?? "").includes(searchTerm) || // Partner name
      normalizeString(item?.sub_category_name?.sub_category_name ?? "").includes(searchTerm) || // Sub-category
      normalizeString(String(item?.total_amount ?? "")).includes(searchTerm) || // Amount
      normalizeString(item?.visit_address ?? "").includes(searchTerm) || // Visited Address
      normalizeString(item?.payment_mode ?? "").includes(searchTerm) || // Payment Mode
      normalizeString(item?.booking_status ?? "").includes(searchTerm) || // Booking Status
      normalizeString(item?.instructions ?? "").includes(searchTerm) || // Instructions
      normalizeNumber(item?.billing_amount) === searchTermNumber || // Billing Amount as a number
      normalizeString(formatDateTime(item?.visit_date)).includes(searchTerm) || // Visit Date formatted
      normalizeString(formatDateTime(item?.created_at)).includes(searchTerm) || // Created Date formatted
      normalizeString(formatDateTime(item?.reached_location)).includes(searchTerm) || // Reached Location formatted
      normalizeString(formatDateTime(item?.start_job)).includes(searchTerm) || // Start Job formatted
      normalizeString(formatDateTime(item?.end_job)).includes(searchTerm) || // End Job formatted
      normalizeString(formatDateTime(item?.payment)).includes(searchTerm) || // Payment formatted
      normalizeString(item?.car_type ?? "").includes(searchTerm) || // Car Type
      normalizeString(item?.transmission_type ?? "").includes(searchTerm) || // Transmission Type
      normalizeNumber(item?.people_count) === searchTermNumber || // People Count as number
      normalizeNumber(item?.no_of_hours_booked) === searchTermNumber ||
      normalizedDishes.includes(searchTerm) ||
      normalizeString(item?.menu ?? "N/A").includes(searchTerm) || // Menu (handles null)
      gardenerDates.includes(searchTerm)
    );
  });
  
  
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showPriceDetailModal, setShowPriceDetailModal] = useState(false);

  const handleOpenPriceDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowPriceDetailModal(true);
  };

  const handleClosePriceDetailModal = () => {
    setShowPriceDetailModal(false);
  };

  const renderPagination = () => {
    if (filteredData.length <= entriesPerPage) return null;
  
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  
    // Determine the range of pages to display
    const pageNumbers = [];
    const pagesToShow = 3; // Number of page numbers to display at a time
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
    // Adjust startPage if we are near the last pages
    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }
  
    // Collect page numbers for display
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination justify-content-center" style={{ gap: "5px" }}>
          {/* First Page Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
            >
              First
            </button>
          </li>
  
          {/* Previous Page Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
  
          {/* Page Numbers */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            </li>
          ))}
  
          {/* Next Page Button */}
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
  
          {/* Last Page Button */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="SubCategory-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Bookings</h2>
        <input
        type="text"
        className="form-control search-input w-25"
        placeholder="Search by guest name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      </div>
      <div className="d-flex justify-content-between align-items-center">
        
  <p>From Date:</p>
  <input
    type="date"
    className="form-control w-25"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    max={toDate} // Ensures "From Date" is not after "To Date"
  />
  
  <p>To Date:</p>
  <input
    type="date"
    className="form-control w-25"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    min={fromDate} // Ensures "To Date" is not before "From Date"
  />

  <button className="btn btn-primary" style={{boxShadow:"none"}} onClick={handleSearch}>Search</button>
  <button className="btn btn-secondary" style={{boxShadow:"none"}} onClick={handleRemoveFilter}>Remove Filter</button>
</div>


      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-bordered table-user">
              <thead className="heading_user">
                <tr>
                  <th scope="col" style={{ width: "5%" }}>
                    Sr.
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Booking Id
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Partner Id
                  </th>
                   <th scope="col" style={{ width: "10%" }}>
                    Partner Name
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Customer Id
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Customer Name
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Customer Phone No
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Sub Category
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Status
                  </th>
                  {category_id === "1" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Menu
                    </th>
                  )}
                  {category_id === "1" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Dishes
                    </th>
                  )}
                   {category_id === "2" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Car Type
                    </th>
                  )}
                  {category_id === "2" && (
                    <th scope="col" style={{ width: "10%" }}>
                     Transmission Type
                    </th>
                  )}
                  
                  {(category_id === "1" || category_id === "2") && (
                    <th scope="col" style={{ width: "15%" }}>
                      {category_id === "1" ? "No of People" : "No of Hours"}
                    </th>
                  )}
                  
                  <th scope="col" style={{ width: "5%" }}>
                    Amount
                  </th>
                  {(category_id === "1" || category_id === "3") && (
                    <th scope="col" style={{ width: "10%" }}>
                      Address
                    </th>
                  )}

                  {category_id === "2" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Address From
                    </th>
                  )}
                  {category_id === "2" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Address To
                    </th>
                  )}
                  <th scope="col" style={{ width: "15%" }}>
                    Visit Date
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    Booking Date
                  </th>
                 
                  {category_id !== "3" && (
                  <th scope="col" style={{ width: "15%" }}>
                    Partner Reached Time
                  </th>
                  )}
                  {category_id !== "3" && (
                  <th scope="col" style={{ width: "15%" }}>
                    Booking Start Time
                  </th>
                  )}
                  {category_id !== "3" && (
                  <th scope="col" style={{ width: "15%" }}>
                    Booking End Time
                  </th>
                  )}
                   {category_id !== "3" && (
                  <th scope="col" style={{ width: "15%" }}>
                    Payment Time
                  </th>
                   )}

                  <th scope="col" style={{ width: "10%" }}>
                    Payment Mode
                  </th>
                  {category_id === "3" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Visit Slot Count
                    </th>
                  )}
                   {category_id === "3" && (
                    <th scope="col" style={{ width: "25%" }}>
                      Gardner Visit Dates
                    </th>
                  )}
                   {category_id === "3" && (
                  <th scope="col" style={{ width: "15%" }}>
                    Service Slots
                  </th>)}
                  {category_id !== "1" && ( <th scope="col" style={{ width: "10%" }}> Hours Booked </th>)}
                  <th scope="col" style={{ width: "10%" }}>
                    Special Request
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Attachments
                  </th>
                  {/* <th scope="col" style={{ width: "10%" }}>
                    Status
                  </th> */}
                  <th scope="col" style={{ width: "5%" }}>
                    Action
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Partner Reassign
                  </th>
                  <th scope="col" style={{width:"13%"}}>Customer Invoice</th>
                  <th scope="col" style={{width:"12%"}}>Partner Invoice</th>
                </tr>
              </thead>
              <tbody>
  {currentEntries.length > 0 ? (
    currentEntries.map((item, index) => (
      <tr key={item.booking_id}>
        <th scope="row">{indexOfFirstEntry + index + 1}.</th>
        <td>{item.booking_id || "N/A"}</td>
<td 
  style={{ 
    cursor: "pointer",
    color: item?.partner?.uid ? "blue" : "black"
  }}
  onClick={() => {
    if (item?.partner?.id) {
      fetchPartnerDetails(item.partner.id);
    }
  }}
>
  {item?.partner?.uid || "N/A"}
</td>
       <td>{item.partner?.name || "Not assigned yet"}</td>
<td 
  style={{ 
    cursor: "pointer",
    color: item?.customer?.id ? "blue" : "black"
  }}
  onClick={() => {
    if (item?.customer?.id) {
      fetchCustomerDetails(item.customer.id);
    }
  }}
>
  {item?.customer?.id || "N/A"}
</td>
       <td>{item.guest_name || "N/A"}</td>
        <td>{item?.customer?.mobile || "N/A"}</td>
        <td>{item.sub_category_name?.sub_category_name || "Unknown"}</td>
         <td
  style={
    item.booking_status === "not-started"
      ? { backgroundColor: "#fff3cd", color: "#dc3545", fontWeight: "bold" }
      : {}
  }
>
  {item.booking_status
    ? item.booking_status.charAt(0).toUpperCase() + item.booking_status.slice(1)
    : "N/A"}
</td>
        {category_id === "1" && <td>{item.menu || "N/A"}</td>}
        {category_id === "1" && (
    <td>{item.dishes || "N/A"}</td>
)}

        {category_id === "2" && <td>{item.car_type || "N/A"}</td>}
        {category_id === "2" && <td>{item.transmission_type || "N/A"}</td>}
        {(category_id === "1" || category_id === "2") && (
            <td>
              {category_id === "1" 
                ? item.people_count || "N/A" 
                : item.no_of_hours_booked || "N/A"
              }
            </td>
          )}
        <td>
          {item.billing_amount || "N/A"}
          <i
            className="fa fa-eye text-primary ml-2"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenPriceDetailModal(item)} // Open modal on click
          />
        </td>

        {(category_id === "1" || category_id === "3") && (
          <td>{item.visit_address || "No current_address available."}</td>
        )}
        {category_id === "2" && <td>{item.address_from || "No current_address available."}</td>}
        {category_id === "2" && <td>{item.address_to || "No current_address available."}</td>}

        <td>
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })
            .format(new Date(item.visit_date))
            .replace(",", "")},{" "}
          {(() => {
            const [hour, minute] = item.visit_time.split(":"); // Extract hour and minute
            const date = new Date();
            date.setHours(hour, minute); // Set extracted time

            return date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true, // Convert to 12-hour format
            });
          })()}
        </td>

        <td>{item.created_at ? formatDateWithTime(item.created_at) : "N/A"}</td>
        
        {category_id !== "3" && (<td>{item.reached_location ? formatDateWithTime(item.reached_location) : "N/A"}</td>)}
        {category_id !== "3" && (<td>{item.start_job ? formatDateWithTime(item.start_job) : "N/A"}</td>)}
        {category_id !== "3" && (<td>{item.end_job ? formatDateWithTime(item.end_job) : "N/A"}</td>)}
        {category_id !== "3" && (<td>{item.payment ? formatDateWithTime(item.payment) : "N/A"}</td>)}

        <td>{formatPaymentMode(item.payment_mode)}</td>

   {category_id == "3" && (
  <td>
    {item.sub_category_name?.sub_category_name === "One Time Visit" 
      ? "1" 
      : item.gardener_visiting_slot_count || "NA"}
  </td>
)}  
     
 {category_id == "3" && (
  <td style={{ width: "200px", whiteSpace: "nowrap" }}>
    {item.sub_category_name?.sub_category_name === "One Time Visit"
      ? format(new Date(item.visit_date), "dd MMM yyyy")
      : item.gardener_visiting_slots?.length > 0
        ? item.gardener_visiting_slots.map((slot, index) => (
            <span key={index}>
              {index + 1}. {format(new Date(slot.date), "dd MMM yyyy")}
              <br />
            </span>
          ))
        : "NA"}
  </td>
)}
{category_id === "3" && (<td> <i className="fa fa-eye text-primary ml-2" style={{ cursor: "pointer" }}        onClick={() => handleOpenGardenerSlotsModal(
        item.gardener_visiting_slots,  item.booking_complete_dates)} ></i></td>)}

        {category_id !== "1" && <td>{item.no_of_hours_booked || "NA"}</td>}

        <td>{item.instructions || "N/A"}</td>
        <td>
          {item.start_job_attachments.length > 0 || item.end_job_attachments.length > 0 ? (
            <i
              className="fa fa-eye text-primary"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleOpenAttachmentModal({
                  start: item.start_job_attachments,
                  end: item.end_job_attachments,
                })
              }
            />
          ) : (
            "No Attachments"
          )}
        </td>
        {/* <td
  style={
    item.booking_status === "not-started"
      ? { backgroundColor: "#fff3cd", color: "#dc3545", fontWeight: "bold" }
      : {}
  }
>
  {item.booking_status
    ? item.booking_status.charAt(0).toUpperCase() + item.booking_status.slice(1)
    : "N/A"}
</td> */}

<td>
  <i
    className={`fa fa-pencil-alt ${item.cancel_button ? "text-primary" : "text-muted"}`}
    style={{
      cursor: item.cancel_button ? "pointer" : "not-allowed",
      opacity: item.cancel_button ? 1 : 0.5,
    }}
    onClick={() =>
      item.cancel_button
        ? handleOpenEditModal(item.booking_id, item.booking_status, item.partner_id, item.category_id)
        : null
    }
  />
</td>

<td
  style={{ textAlign: "center", cursor: "pointer" }}
  onClick={() => {
    setSelectedBooking(item);
    setShowReassignModal(true);
  }}
>
  <FaPeopleArrows />
</td>   
{/* <td style={{ textAlign: "center" }}>
  <PDFDownloadLink
    document={<CustomerInvoiceDocument customer={item} />}
    fileName={`invoice-${item.booking_id}.pdf`}
  >
    {({ loading }) =>
      loading ? 'Loading...' : (
        <button className="payNow-btn">
          Customer <TbFileInvoice />
        </button>
      )
    }
  </PDFDownloadLink>
</td>


<td style={{ textAlign: "center" }}>
  <PDFDownloadLink
    document={<PartnerInvoiceDocument customer={item} />}
    fileName={`invoice-${item.booking_id}.pdf`}
  >
    {({ loading }) =>
      loading ? 'Loading...' : (
        <button className="payNow-btn">
          Partner <TbFileInvoice />
        </button>
      )
    }
  </PDFDownloadLink>
</td> */}

{["completed", "cancelled"].includes(item.booking_status) ? (
  <>
    <td style={{ textAlign: "center" }}>
      {item.booking_status === "cancelled" && item.cancel_charge_amount === 0 ? (
        <button
          className="payNow-btn"
          style={{
            backgroundColor: "#ccc",
            color: "#666",
            cursor: "not-allowed",
          }}
          disabled
        >
          Customer <TbFileInvoice />
        </button>
      ) : (
        <PDFDownloadLink
          document={<CustomerInvoiceDocument customer={item} />}
          fileName={`Invoice-${item.booking_id}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              "Loading..."
            ) : (
              <button className="payNow-btn">
                Customer <TbFileInvoice />
              </button>
            )
          }
        </PDFDownloadLink>
      )}
    </td>

    <td style={{ textAlign: "center" }}>
      {item.booking_status === "cancelled" ? (
        <button
          className="payNow-btn"
          style={{
            backgroundColor: "#ccc",
            color: "#666",
            cursor: "not-allowed",
          }}
          disabled
        >
          Partner <TbFileInvoice />
        </button>
      ) : (
        <PDFDownloadLink
          document={<PartnerInvoiceDocument customer={item} />}
          fileName={`Invoice-${item.booking_id}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              "Loading..."
            ) : (
              <button className="payNow-btn">
                Partner <TbFileInvoice />
              </button>
            )
          }
        </PDFDownloadLink>
      )}
    </td>
  </>
) : (
  <>
    <td style={{ textAlign: "center" }}>
      <button
        className="payNow-btn"
        style={{
          backgroundColor: "#ccc",
          color: "#666",
          cursor: "not-allowed",
        }}
        disabled
      >
        Customer <TbFileInvoice />
      </button>
    </td>
    <td style={{ textAlign: "center" }}>
      <button
        className="payNow-btn"
        style={{
          backgroundColor: "#ccc",
          color: "#666",
          cursor: "not-allowed",
        }}
        disabled
      >
        Partner <TbFileInvoice />
      </button>
    </td>
  </>
)}



 </tr>
    ))
  ) : (
    <tr>
      <td colSpan="100%" className="text-center">
        No data available
      </td>
    </tr>
  )}
</tbody>
    </table>
          </div>
          {renderPagination()}
        </>
      )}

      <AttachmentModal
        open={showAttachmentModal}
        attachments={attachmentsData}
        onClose={handleCloseAttachmentModal}
      />

<PriceDetailModal
        show={showPriceDetailModal}
        onHide={handleClosePriceDetailModal}
        bookingData={selectedBooking}
      />

      <EditStatusModal
        open={showEditModal}
        onClose={handleCloseEditModal}
        bookingId={selectedBookingId}
        partnerId={partnerId}
        categoryId={categoryId}
        getCommissionData={getCommissionData}
        dummyData={dummy_Data}
        setDummyData={setDummy_Data}
        setShowEditModal={setShowEditModal}
      />

    <ReassignPartnerModal
      show={showReassignModal}
      onClose={() => setShowReassignModal(false)}
      onSave={() => {}}
      bookingData={selectedBooking}
      getCommissionData={getCommissionData}
    />
    <GardenerSlotsModal
  show={showGardenerSlotsModal}
  onClose={() => setShowGardenerSlotsModal(false)}
  slots={selectedGardenerSlots}
  bookingCompleteDates={selectedBookingCompleteDates}
/>

<AttachmentModalPartner
  open={showPartnerModal}
  attachments={partnerData}
  onClose={() => setShowPartnerModal(false)}
/>
{showCustomerModal && selectedCustomer && (
  <CustomerInfoModal 
    customer={selectedCustomer} 
    onClose={() => setShowCustomerModal(false)} 
  />
)}
    </div>
  );
};

export default CommonBookingTab;
