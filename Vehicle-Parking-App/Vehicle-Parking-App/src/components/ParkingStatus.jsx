import React from "react";

function ParkingStatus() {
  return (
    <div className="status-grid">

      <div className="status-card">
        <div className="status-icon total">P</div>
        <div>
          <p>Total Slots</p>
          <h3>120</h3>
        </div>
      </div>

      <div className="status-card">
        <div className="status-icon available">✓</div>
        <div>
          <p>Available</p>
          <h3>78</h3>
        </div>
      </div>

      <div className="status-card">
        <div className="status-icon occupied">●</div>
        <div>
          <p>Occupied</p>
          <h3>42</h3>
        </div>
      </div>

      <div className="status-card">
        <div className="status-icon price">₹</div>
        <div>
          <p>Rate / Hour</p>
          <h3>₹40</h3>
        </div>
      </div>

    </div>
  );
}

export default ParkingStatus;