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

const ProfitLossGraph = () => {
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
          text: 'Amount (in Rs)',
        },
      },
    },
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // Example months
    datasets: [
      {
        label: 'Profit',
        data: [5000, 10000, 15000, 20000, 25000, 30000, 35000], // Profit data
        borderColor:  '#123499', // Dark Blue for profit
        backgroundColor: '#123499', // Light dark blue for fill
      },
      {
        label: 'Loss',
        data: [2000, 4000, 6000, 8000, 10000, 12000, 14000], // Loss data
        borderColor:'#4895EF', // Blue for loss
        backgroundColor:'#4895EF', // Light blue for fill
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
    const chart = document.getElementById('profit-loss-chart').toDataURL('image/png');
    if (format === 'pdf') {
      // Implement PDF export logic here
    } else if (format === 'excel') {
      // Implement Excel export logic here
    }
  };

  return (
    <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Profit and Loss Graph</h2>
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
        <Bar id="profit-loss-chart" data={data} options={options} />
      </div>
    </div>
  );
};

export default ProfitLossGraph;
