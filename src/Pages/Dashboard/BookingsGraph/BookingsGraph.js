import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import { saveAs } from 'file-saver';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingsGraph = () => {
  const [timeRange, setTimeRange] = useState('daily');

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // Example months
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Bookings Count',
        },
      },
    },
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // Example months
    datasets: [
      {
        label: 'Cook',
        data: [10, 20, 30, 40, 50, 60, 70], // Cook bookings
        borderColor: '#123499', // Dark Blue for Cook
        backgroundColor: '#123499', // Light dark blue for fill
      },
      {
        label: 'Driver',
        data: [5, 10, 15, 20, 25, 30, 35], // Driver bookings
        borderColor: '#4895EF', // Blue for Driver
        backgroundColor: '#4895EF', // Light blue for fill
      },
      {
        label: 'Gardener',
        data: [3, 6, 9, 12, 15, 18, 21], // Gardener bookings
        borderColor: '#b4d4f8', // Orange for Gardener
        backgroundColor: '#b4d4f8', // Light orange for fill
      },
    ],
  };

  const timeRangeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: '6months', label: '6 Months' },
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' },
  ];

  const handleExport = (format) => {
    const chart = document.getElementById('bookings-chart').toDataURL('image/png');
    if (format === 'pdf') {
      // Implement PDF export logic here
    } else if (format === 'excel') {
      // Implement Excel export logic here
    }
  };

  return (
    <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bookings Graph</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <button
            onClick={() => handleExport('pdf')}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Export to PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Export to Excel
          </button>
        </div>
        <Select
          options={timeRangeOptions}
          value={timeRangeOptions.find((option) => option.value === timeRange)}
          onChange={(selectedOption) => setTimeRange(selectedOption.value)}
          placeholder="Select Time Range"
          styles={{
            control: (styles) => ({
              ...styles,
              borderColor: '#ccc',
            }),
            option: (styles) => ({
              ...styles,
              color: '#333',
              padding: '10px',
            }),
          }}
        />
      </div>

      {/* Wrapping the chart in a scrollable container */}
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <Bar id="bookings-chart" data={data} options={options} />
      </div>
    </div>
  );
};

export default BookingsGraph;
