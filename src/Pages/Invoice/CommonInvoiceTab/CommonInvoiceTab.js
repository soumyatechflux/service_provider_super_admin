
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import { TbFileInvoice } from "react-icons/tb";
import { PDFDownloadLink } from '@react-pdf/renderer';
import CustomerInvoiceDocument from "../CustomerInvoiceDocument/CustomerInvoiceDocument";
import PartnerInvoiceDocument from "../PartnerInvoiceDocument/PartnerInvoiceDocument";

const CommonInvoiceTab = ({ category_id, loading, setLoading }) => {
  function formatDateWithTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${formattedDate}, ${hours}:${minutes} ${ampm}`;
  }

  const formatPaymentMode = (mode) => {
    if (!mode) return "N/A";
    if (mode.toLowerCase() === "online") return "Online";
    if (mode.toLowerCase() === "cod") return "COD";
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  const [dummy_Data, setDummy_Data] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const entriesPerPage = 10;

  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);
  
      const params = { category_id: category_id };
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;
  
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
  
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

  const handleSearch = () => {
    getCommissionData();
  };
  
  const handleRemoveFilter = () => {
    setFromDate("");
    setToDate("");
    getCommissionData();
  };

  const normalizeString = (str) =>
    str?.replace(/\s+/g, " ").trim().toLowerCase() || "";
  
  const filteredData = dummy_Data.filter((item) => {
    const searchTerm = normalizeString(searchInput);
    return (
      normalizeString(item?.guest_name ?? "").includes(searchTerm) ||
      normalizeString(String(item?.booking_id ?? "")).includes(searchTerm) ||
      normalizeString(item?.partner?.name ?? "").includes(searchTerm)
    );
  });
  
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (filteredData.length <= entriesPerPage) return null;
  
    const pageNumbers = [];
    const pagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination justify-content-center" style={{ gap: "5px" }}>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(1)}>
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
  
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(number)}>
                {number}
              </button>
            </li>
          ))}
  
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>
              Last
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="SubCategory-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Booking Invoices</h2>
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
          max={toDate}
        />
        <p>To Date:</p>
        <input
          type="date"
          className="form-control w-25"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        <button className="btn btn-secondary" onClick={handleRemoveFilter}>Remove Filter</button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-bordered table-user">
              <thead className="heading_user">
                <tr>
                  <th scope="col">Sr.</th>
                  <th scope="col">Booking Id</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Partner Name</th>
                  <th scope="col">Sub Category</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Visit Date</th>
                  <th scope="col">Booking Date</th>
                  <th scope="col">Payment Mode</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{width:"13%"}}>Customer Invoice</th>
                  <th scope="col" style={{width:"12%"}}>Partner Invoice</th>

                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={item.booking_id}>
                      <td>{indexOfFirstEntry + index + 1}.</td>
                      <td>{item.booking_id || "N/A"}</td>
                      <td>{item.guest_name || "N/A"}</td>
                      <td>{item.partner?.name || "Not assigned yet"}</td>
                      <td>{item.sub_category_name?.sub_category_name || "Unknown"}</td>
                      <td>{item.billing_amount || "N/A"}</td>
                      <td>{item.visit_date ? formatDateWithTime(item.visit_date) : "N/A"}</td>
                      <td>{item.created_at ? formatDateWithTime(item.created_at) : "N/A"}</td>
                      <td>{formatPaymentMode(item.payment_mode)}</td>
                      <td>
                        {item.booking_status
                          ? item.booking_status.charAt(0).toUpperCase() + item.booking_status.slice(1)
                          : "N/A"}
                      </td>
                      <td style={{ textAlign: "center" }}>
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
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
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
    </div>
  );
};

export default CommonInvoiceTab;