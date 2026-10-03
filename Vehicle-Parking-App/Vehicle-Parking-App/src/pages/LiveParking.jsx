import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ParkingStatus from "../components/ParkingStatus";

import { getParkingStatus } from "../services/api";

function LiveParking() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getParkingStatus();

        if (data.success) {
          setStatus(data.status);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load live parking status.");
      }

      setLoading(false);
    };

    loadStatus();
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="live-parking-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>

            <h3>Loading Live Parking</h3>

            <p>
              Getting the latest parking information...
            </p>
          </div>
        </main>
      </>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <>
        <Navbar />

        <main className="live-parking-page">
          <div className="error-container">
            <div className="error-icon">!</div>

            <h2>Unable to Load Parking</h2>

            <p>{error}</p>

            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  const availabilityPercentage =
    status.total_slots > 0
      ? Math.round(
          (status.available_slots / status.total_slots) * 100
        )
      : 0;

  return (
    <>
      <Navbar />

      <main className="live-parking-page">

        {/* =================================
            PAGE HEADER
        ================================= */}

        <section className="live-header">

          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE PARKING STATUS
          </div>

          <h1>
            {status.area_name}
          </h1>

          <p className="live-location">
            <span>⌖</span>
            {status.location}
          </p>

          <p className="live-description">
            Real-time parking availability to help you
            find your space faster.
          </p>

        </section>


        {/* =================================
            MAIN LIVE STATUS
        ================================= */}

        <section className="live-dashboard">

          <div className="live-main-card">

            <div className="live-card-content">

              <span className="live-card-label">
                CURRENT AVAILABILITY
              </span>

              <div className="live-number">
                {status.available_slots}
              </div>

              <p>
                parking spaces available
              </p>

              <div className="availability-bar">

                <div
                  className="availability-bar-fill"
                  style={{
                    width: `${availabilityPercentage}%`,
                  }}
                ></div>

              </div>

              <div className="availability-bar-info">

                <span>
                  {availabilityPercentage}% available
                </span>

                <span>
                  {status.total_slots} total
                </span>

              </div>

            </div>


            <div className="live-circle">

              <div className="live-circle-inner">

                <strong>
                  {status.available_slots}
                </strong>

                <span>
                  FREE
                </span>

              </div>

            </div>

          </div>


          {/* =================================
              STATUS CARDS
          ================================= */}

          <div className="live-stats-grid">

            <div className="live-stat-card">

              <div className="live-stat-icon total-icon">
                P
              </div>

              <div>
                <span>
                  TOTAL SPACES
                </span>

                <strong>
                  {status.total_slots}
                </strong>
              </div>

            </div>


            <div className="live-stat-card available-stat">

              <div className="live-stat-icon available-icon">
                ✓
              </div>

              <div>
                <span>
                  AVAILABLE
                </span>

                <strong>
                  {status.available_slots}
                </strong>
              </div>

            </div>


            <div className="live-stat-card occupied-stat">

              <div className="live-stat-icon occupied-icon">
                ×
              </div>

              <div>
                <span>
                  OCCUPIED
                </span>

                <strong>
                  {status.booked_slots}
                </strong>
              </div>

            </div>


            <div className="live-stat-card">

              <div className="live-stat-icon price-icon">
                ₹
              </div>

              <div>
                <span>
                  RATE / HOUR
                </span>

                <strong>
                  ₹{status.price_per_hour}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* =================================
            PARKING STATUS COMPONENT
        ================================= */}

        <section className="live-status-section">

          <div className="section-heading">

            <span className="section-eyebrow">
              PARKING OVERVIEW
            </span>

            <h2>
              Current Parking Status
            </h2>

            <p>
              Monitor available and occupied spaces
              in real time.
            </p>

          </div>

          <ParkingStatus
            total={status.total_slots}
            available={status.available_slots}
            occupied={status.booked_slots}
            price={status.price_per_hour}
          />

        </section>


        {/* =================================
            BOOKING CTA
        ================================= */}

        <section className="live-booking-cta">

          <div className="cta-icon">
            P
          </div>

          <div className="cta-content">

            <span>
              FOUND YOUR SPOT?
            </span>

            <h2>
              Reserve your parking space now.
            </h2>

            <p>
              Choose an available slot and complete
              your booking in just a few steps.
            </p>

          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/slots")}
          >
            View Available Slots
            <span>→</span>
          </button>

        </section>

      </main>
    </>
  );
}

export default LiveParking;