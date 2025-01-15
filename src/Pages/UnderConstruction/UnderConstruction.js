
import React from 'react';
import '../ServerDown/ServerDown.css';

const UnderConstruction = () => {
  return (
    <div className="server-down-container">
      <div className="server-down-content">
        <h1>Oops! Site is in Under Maintenance</h1>
        <img src="./images/UnderMaintainance.jpg" alt="Server Down" className="server-down-image" />
        <p>We're experiencing some technical difficulties.</p>
        <p>Our team is working hard to get things back up and running.</p>
        <div className="estimated-time">
          <h2>Estimated Recovery Time</h2>
          <p>2 hours</p>
        </div>
        <button className="refresh-button" onClick={() => window.location.reload()}>
          Refresh Page
        </button>
        <div className="contact-info">
          <p>If you need immediate assistance, please contact our support team:</p>
          <a href="mailto:support@example.com">support@example.com</a>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
