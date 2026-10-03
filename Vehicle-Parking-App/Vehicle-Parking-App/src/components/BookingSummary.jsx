import React from "react";

function BookingSummary({ slot, date, startTime, endTime }) {
  if (!slot) {
    return null;
  }

  return (
    <div className="booking-summary">

      <div className="summary-header">
        <span>BOOKING SUMMARY</span>
        <span className="summary-dot"></span>
      </div>

      <h2>Nexus Mall</h2>
      <p className="summary-location">
        Hyderabad
      </p>

      <div className="summary-row">
        <span>Parking Slot</span>
        <strong>{slot.number}</strong>
      </div>

      <div className="summary-row">
        <span>Date</span>
        <strong>{date || "Not selected"}</strong>
      </div>

      <div className="summary-row">
        <span>Time</span>
        <strong>
          {startTime || "--:--"} - {endTime || "--:--"}
        </strong>
      </div>

      <div className="summary-row total-row">
        <span>Estimated Amount</span>
        <strong>₹40 / hour</strong>
      </div>

    </div>
  );
}

export default BookingSummary;