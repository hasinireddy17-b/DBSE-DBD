import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getAvailableSlots } from "../services/api";

function SlotSelection() {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const data = await getAvailableSlots();

        if (data.success) {
          setSlots(data.slots);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load available slots.");
      }

      setLoading(false);
    };

    loadSlots();
  }, []);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      alert("Please select a parking slot.");
      return;
    }

    localStorage.setItem(
      "selectedSlot",
      JSON.stringify(selectedSlot)
    );

    navigate("/booking");
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="slot-selection-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>

            <h3>Finding Available Slots</h3>

            <p>
              Checking the latest parking availability...
            </p>
          </div>
        </main>
      </>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <>
      <Navbar />

      <main className="slot-selection-page">

        {/* =================================
            HEADER
        ================================= */}

        <section className="slot-header">

          <div className="slot-badge">
            <span className="status-dot"></span>
            LIVE AVAILABILITY
          </div>

          <h1>
            Choose Your Parking Spot
          </h1>

          <p>
            Select an available parking slot at
            <strong> Nexus Mall</strong>.
          </p>

        </section>


        {/* =================================
            PARKING INFO
        ================================= */}

        <section className="slot-info-bar">

          <div className="slot-info-item">

            <div className="slot-info-icon">
              P
            </div>

            <div>
              <span>LOCATION</span>
              <strong>Nexus Mall</strong>
            </div>

          </div>


          <div className="slot-info-item">

            <div className="slot-info-icon available-symbol">
              ✓
            </div>

            <div>
              <span>AVAILABLE</span>
              <strong>{slots.length} Spaces</strong>
            </div>

          </div>


          <div className="slot-info-item">

            <div className="slot-info-icon">
              ₹
            </div>

            <div>
              <span>BOOKING</span>
              <strong>Secure & Easy</strong>
            </div>

          </div>

        </section>


        {/* =================================
            LEGEND
        ================================= */}

        <div className="slot-legend">

          <div className="legend-item">
            <span className="legend-box available"></span>
            Available
          </div>

          <div className="legend-item">
            <span className="legend-box selected"></span>
            Selected
          </div>

          <div className="legend-item">
            <span className="legend-box occupied"></span>
            Occupied
          </div>

        </div>


        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="error-container">
            <div className="error-icon">!</div>

            <h3>Something went wrong</h3>

            <p>{error}</p>
          </div>
        )}


        {/* =================================
            PARKING AREA
        ================================= */}

        {!error && slots.length > 0 && (
          <section className="parking-map">

            <div className="parking-map-header">

              <div>
                <span className="section-eyebrow">
                  PARKING AREA
                </span>

                <h2>
                  Select a Slot
                </h2>
              </div>

              <div className="slot-count">
                {slots.length} available
              </div>

            </div>


            {/* Entrance */}

            <div className="parking-entrance">
              <span>ENTRANCE</span>
              <div className="entrance-line"></div>
            </div>


            {/* Slots */}

            <div className="slots-grid">

              {slots.map((slot) => {

                const isSelected =
                  selectedSlot?.slot_id === slot.slot_id;

                return (
                  <button
                    key={slot.slot_id}
                    type="button"
                    className={
                      isSelected
                        ? "slot-card selected"
                        : "slot-card available"
                    }
                    onClick={() => handleSelectSlot(slot)}
                  >

                    <div className="slot-card-top">

                      <span className="slot-number">
                        {slot.slot_number}
                      </span>

                      {isSelected && (
                        <span className="selected-check">
                          ✓
                        </span>
                      )}

                    </div>

                    <span className="slot-type">
                      {slot.vehicle_type}
                    </span>

                    <span className="slot-status">
                      {isSelected
                        ? "SELECTED"
                        : "AVAILABLE"}
                    </span>

                  </button>
                );
              })}

            </div>

          </section>
        )}


        {/* =================================
            EMPTY STATE
        ================================= */}

        {!error && slots.length === 0 && (
          <div className="empty-state">

            <div className="empty-icon">
              P
            </div>

            <h2>
              No Parking Slots Available
            </h2>

            <p>
              All parking spaces are currently occupied.
              Please check again later.
            </p>

            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Refresh Availability
            </button>

          </div>
        )}


        {/* =================================
            SELECTED SLOT SUMMARY
        ================================= */}

        {selectedSlot && (
          <section className="selected-slot-panel">

            <div className="selected-slot-info">

              <span>
                YOUR SELECTED SLOT
              </span>

              <strong>
                {selectedSlot.slot_number}
              </strong>

              <p>
                {selectedSlot.vehicle_type} parking
              </p>

            </div>


            <div className="selected-slot-action">

              <button
                className="continue-button"
                onClick={handleContinue}
              >
                Continue to Booking
                <span>→</span>
              </button>

            </div>

          </section>
        )}

      </main>
    </>
  );
}

export default SlotSelection;