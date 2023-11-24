// RestorePopup.jsx

import React from 'react';

const RestorePopup = ({ onRestore }) => {
  // Function to handle restoring data
  const handleRestore = () => {
    onRestore();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <p>Previous data found! Restore?</p>
        <button onClick={handleRestore}>Restore Previous Data</button>
      </div>
    </div>
  );
};

export default RestorePopup;
