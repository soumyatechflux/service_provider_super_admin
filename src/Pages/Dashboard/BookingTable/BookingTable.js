import React, { useState } from 'react';

// Example data for the table
const bookingData = [
  { id: 1, bookings: 20, category: 'Cook', time: 'January' },
  { id: 2, bookings: 15, category: 'Driver', time: 'February' },
  { id: 3, bookings: 10, category: 'Gardener', time: 'March' },
  { id: 4, bookings: 30, category: 'Cook', time: 'April' },
  { id: 5, bookings: 25, category: 'Driver', time: 'May' },
  { id: 6, bookings: 18, category: 'Gardener', time: 'June' },
];

const BookingTable = () => {
  const [data] = useState(bookingData); // Use state to hold the booking data

  return (
    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Booking Table</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Bookings</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Category</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking) => (
            <tr key={booking.id} style={{ textAlign: 'center' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.bookings}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.category}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
