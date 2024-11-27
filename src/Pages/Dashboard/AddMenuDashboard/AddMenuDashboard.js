import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AddMenuDashboard.css';

const AddMenuDashboard = () => {
  const navigate = useNavigate(); // Declare the useNavigate hook

  // Function to handle button click and navigate to /restaurant
  const handleButtonClick = () => {
    navigate('/restaurant');
  };

  return (
    <div className='container container_AddMenu_Dashboard'>
      <div className='box_AddMenu_Dashboard'>
        <div className='cookimg_AddMenu_Dashboard'>
          <img className='cookpic_AddMenu_Dashboard' src='./assets/images/Dashboard/Cook.png' alt='' />
        </div>
        <div className='text_AddMenu_Dashboard'>
          See all the Restaurant Details through button below
        </div>
        <div className='buttonContainer_AddMenu_Dashboard'>
          <button 
            className='btn_AddMenu_Dashboard' 
            onClick={handleButtonClick} // Add onClick handler to the button
          >
            + Restaurant Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMenuDashboard;
