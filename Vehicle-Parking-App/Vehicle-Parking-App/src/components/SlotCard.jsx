import React from "react";

function SlotCard({ slot, selected, onSelect }) {
  const isAvailable = slot.status === "available";

  return (
    <button
      className={`slot-card ${slot.status} ${
        selected ? "selected" : ""
      }`}
      disabled={!isAvailable}
      onClick={() => onSelect(slot)}
    >

      <div className="slot-top">
        <span className="slot-number">
          {slot.number}
        </span>

        <span className={`slot-status ${slot.status}`}>
          {isAvailable ? "Available" : "Occupied"}
        </span>
      </div>

      <div className="slot-symbol">
        🚗
      </div>

      <span className="slot-floor">
        {slot.floor}
      </span>

    </button>
  );
}

export default SlotCard;