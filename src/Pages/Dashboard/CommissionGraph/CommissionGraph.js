import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import { saveAs } from 'file-saver';

// Register the components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const CommissionGraph = () => {
  const [timeRange, setTimeRange] = useState('daily');

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: [10, 50, 100, 200, 300, 400, 500],  // Extended data for x-axis
        title: {
          display: true,
          text: 'Units Sold',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Commission (in Rupees)',
        },
      },
    },
  };

  const data = {
    labels: [10, 50, 100, 200, 300, 400, 500],  // Extended data for x-axis
    datasets: [
      {
        label: 'Commission',
        data: [200, 1000, 2500, 5000, 6000, 7000, 8000], // Corresponding data for y-axis (Commission)
        borderColor: 'rgba(0, 123, 255, 1)', // Blue color for the border
        backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue color for the fill
        fill: true,
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
    const chart = document.getElementById('commission-chart').toDataURL('image/png');
    if (format === 'pdf') {
      // Implement PDF export logic here
    } else if (format === 'excel') {
      // Implement Excel export logic here
    }
  };

  return (
    <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Commission Graph</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <button onClick={() => handleExport('pdf')} style={{ marginRight: '10px' }}>Export to PDF</button>
          <button onClick={() => handleExport('excel')}>Export to Excel</button>
        </div>
        <Select
          options={timeRangeOptions}
          value={timeRangeOptions.find((option) => option.value === timeRange)}
          onChange={(selectedOption) => setTimeRange(selectedOption.value)}
          placeholder="Select Time Range"
        />
      </div>

      {/* Wrapping the chart in a scrollable container */}
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <Line id="commission-chart" data={data} options={options} />
      </div>
    </div>
  );
};

export default CommissionGraph;
