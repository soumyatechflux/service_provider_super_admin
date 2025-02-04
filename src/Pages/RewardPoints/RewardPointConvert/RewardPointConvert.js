

import React, { useState } from "react";
import "./RewardPointConvert.css"; // Importing CSS file for styling

const RewardPointConvert = () => {
  const [conversionRate, setConversionRate] = useState(10); // Default: 10 points = 1 rupee
  const [minPoints, setMinPoints] = useState(100); // Default: Minimum 100 points required to redeem

  const handleSave = () => {
    alert(`Settings saved! \nConversion Rate: ${conversionRate} Points = 1 Rupee\nMinimum Points: ${minPoints}`);
  };

  return (
    <div className="admin-rewards-container">
      <h2 className="admin-rewards-title">Reward Points Settings</h2>
      <div className="admin-rewards-input-group">
        <label className="admin-rewards-label">Points per 1 Rupee:</label>
        <input
          type="number"
          className="admin-rewards-input"
          value={conversionRate}
          onChange={(e) => setConversionRate(e.target.value)}
        />
      </div>
      <div className="admin-rewards-input-group">
        <label className="admin-rewards-label">Minimum Points to Redeem:</label>
        <input
          type="number"
          className="admin-rewards-input"
          value={minPoints}
          onChange={(e) => setMinPoints(e.target.value)}
        />
      </div>
      <button className="admin-rewards-button" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
};

export default RewardPointConvert;
