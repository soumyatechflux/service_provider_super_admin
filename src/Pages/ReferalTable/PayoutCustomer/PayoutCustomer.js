
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const PayoutCustomer = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const entriesPerPage = 10;

  // Fetch partner data
  const fetchPartnerData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');

    if (!token) {
      console.error('Token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/api/admin/partners`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch partner data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data?.success && Array.isArray(data.data)) {
        setPartners(data.data);
      } else {
        console.error('Invalid API response structure.');
        setPartners([]);
      }
    } catch (error) {
      console.error('Error fetching partner data:', error);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, []);

  // Normalize string for case-insensitive search
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, ' ').trim().toLowerCase() || '';
  
  // Filtered data based on search input
  const filteredData = partners.filter((partner) => {
    const searchTerm = normalizeString(searchInput);
    return (
      normalizeString(partner.partnerName).includes(searchTerm) ||
      normalizeString(partner.referralCode).includes(searchTerm) ||
      normalizeString(partner.referralPoints.toString()).includes(searchTerm)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Referral-Table-Main p-3">
      {/* Header and Search */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Payout Partner Table</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by partner name or referral code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="table-responsive mb-5">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Partner Name</th>
                  <th>Referral Points</th>
                  <th>Referral Code</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((partner, index) => (
                    <tr key={partner.id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{partner.partnerName || 'N/A'}</td>
                      <td>{partner.referralPoints || 'N/A'}</td>
                      <td>{partner.referralCode || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center">
              <ul className="pagination mb-0" style={{ gap: '5px' }}>
                {/* First Page */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(1)}
                  >
                    First
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((number) => (
                    <li
                      key={number}
                      className={`page-item ${currentPage === number ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}

                {/* Last Page */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    Last
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default PayoutCustomer;
