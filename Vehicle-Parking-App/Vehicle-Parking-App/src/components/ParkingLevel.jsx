import React from "react";

function ParkingLevel({ level, available, total }) {
  const percentage = Math.round((available / total) * 100);

  return (
    <div className="level-card">

      <div className="level-info">
        <div>
          <span className="level-label">PARKING LEVEL</span>
          <h3>{level}</h3>
        </div>

        <div className="level-availability">
          <strong>{available}</strong>
          <span>/ {total} available</span>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <span className="availability-text">
        {percentage}% availability
      </span>

    </div>
  );
}

export default ParkingLevel;