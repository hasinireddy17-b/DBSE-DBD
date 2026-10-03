import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ParkingStatus from "../components/ParkingStatus";

import { getParkingArea } from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArea = async () => {
      try {
        const data = await getParkingArea();

        if (data.success) {
          setArea(data.area);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load parking information.");
      }

      setLoading(false);
    };

    loadArea();
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="home-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>

            <h3>Loading NexusPark</h3>

            <p>
              Getting the latest parking availability...
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

        <main className="home-page">
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

  const occupied = area.total_slots - area.available_slots;

  const availabilityPercentage =
    area.total_slots > 0
      ? Math.round(
          (area.available_slots / area.total_slots) * 100
        )
      : 0;

  return (
    <>
      <Navbar />

      <main className="home-page">

        {/* =====================================
            HERO SECTION
        ===================================== */}

        <section className="hero-section">

          <div className="hero-glow"></div>

          <div className="hero-content">

            <div className="hero-badge">
              <span className="status-dot"></span>
              LIVE SMART PARKING
            </div>

            <h1>
              Park Smarter.
              <br />

              <span>
                Arrive Stress-Free.
              </span>
            </h1>

            <p className="hero-description">
              Find, reserve and manage your parking
              space at <strong>{area.area_name}</strong>{" "}
              with NexusPark.
            </p>

            <div className="hero-location">
              <span className="location-icon">⌖</span>

              <span>
                {area.location}
              </span>
            </div>

            <div className="hero-actions">

              <button
                className="hero-primary-btn"
                onClick={() => navigate("/live-parking")}
              >
                Find a Parking Slot
                <span>→</span>
              </button>

              <button
                className="hero-secondary-btn"
                onClick={() => navigate("/my-bookings")}
              >
                My Bookings
              </button>

            </div>

          </div>

        </section>


        {/* =====================================
            LIVE PARKING OVERVIEW
        ===================================== */}

        <section className="parking-overview">

          <div className="section-heading">

            <div className="section-eyebrow">
              REAL-TIME DATA
            </div>

            <h2>
              Parking Availability
            </h2>

            <p>
              Current parking status at{" "}
              <strong>{area.area_name}</strong>
            </p>

          </div>


          {/* Main Availability Card */}

          <div className="availability-highlight">

            <div className="availability-main">

              <div className="availability-label">
                AVAILABLE SPACES
              </div>

              <div className="availability-number">
                {area.available_slots}
              </div>

              <div className="availability-total">
                out of {area.total_slots} total spaces
              </div>

            </div>


            <div className="availability-progress">

              <div className="progress-circle">

                <div className="progress-inner">

                  <strong>
                    {availabilityPercentage}%
                  </strong>

                  <span>Available</span>

                </div>

              </div>

            </div>

          </div>


          {/* Status Cards */}

          <div className="parking-status-wrapper">

            <ParkingStatus
              total={area.total_slots}
              available={area.available_slots}
              occupied={occupied}
              price={area.price_per_hour}
            />

          </div>


          {/* Information Cards */}

          <div className="home-info-grid">

            <div className="home-info-card">

              <div className="info-card-icon">
                P
              </div>

              <div>
                <span className="info-label">
                  PARKING LOCATION
                </span>

                <strong>
                  {area.area_name}
                </strong>

                <p>
                  {area.location}
                </p>
              </div>

            </div>


            <div className="home-info-card">

              <div className="info-card-icon">
                ₹
              </div>

              <div>
                <span className="info-label">
                  PARKING RATE
                </span>

                <strong>
                  ₹{area.price_per_hour}/hour
                </strong>

                <p>
                  Simple and transparent pricing
                </p>
              </div>

            </div>


            <div className="home-info-card">

              <div className="info-card-icon">
                ✓
              </div>

              <div>
                <span className="info-label">
                  SMART BOOKING
                </span>

                <strong>
                  Reserve Your Space
                </strong>

                <p>
                  Select your preferred parking slot
                </p>
              </div>

            </div>

          </div>


          {/* Bottom CTA */}

          <div className="home-cta">

            <div>

              <span>
                READY TO PARK?
              </span>

              <h2>
                Find your spot in seconds.
              </h2>

            </div>

            <button
              onClick={() => navigate("/live-parking")}
              className="primary-btn"
            >
              View Available Slots →
            </button>

          </div>

        </section>

      </main>
    </>
  );
}

export default Home;