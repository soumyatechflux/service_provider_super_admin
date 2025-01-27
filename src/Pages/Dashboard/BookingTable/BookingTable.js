import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingTable = () => {
  const [data, setData] = useState([]); // State to store booking data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const currentYear = new Date().getFullYear(); // Automatically use the current year

  const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider'); // Get token from sessionStorage

  // Fetch data from API for the current year
  const fetchData = async () => {
    setLoading(true);

    try {
      const apiUrl = `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/dashboard/bookings?year=${currentYear}`;
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        const fetchedData = response.data.data.map((item) => ({
          month: item.month,
          bookingCount: item.booking_count,
        }));
        setData(fetchedData);
      } else {
        setData([]);
        toast.warning('No booking data found for this year.');
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
      toast.error('Failed to fetch booking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Booking Table for {currentYear}</h2>

      {/* Booking Data Table */}
      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Month</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Booking Count</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((booking, index) => (
                <tr key={index} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.month}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.bookingCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center', padding: '10px' }}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingTable;