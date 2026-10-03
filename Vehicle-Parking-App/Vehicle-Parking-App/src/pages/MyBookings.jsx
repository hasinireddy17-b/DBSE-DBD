import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserBookings } from "../services/api";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(userData);

        if (!user.user_id) {
          setError("User information not found. Please login again.");
          setLoading(false);
          return;
        }

        const data = await getUserBookings(user.user_id);

        if (data.success) {
          setBookings(data.bookings || []);
        } else {
          setError(data.message || "Unable to load your bookings.");
        }
      } catch (err) {
        console.error("Error loading bookings:", err);
        setError("Unable to connect to the booking server.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  return (
    <div className="my-bookings-page">

      <Navbar />

      <main className="my-bookings-container">

        {/* PAGE HEADER */}
        <section className="my-bookings-header">

          <div className="my-bookings-title">

            <span className="bookings-eyebrow">
              NEXUSPARK
            </span>

            <h1>
              My <span>Bookings</span>
            </h1>

            <p>
              Manage and view your Nexus Mall parking
              reservations.
            </p>

          </div>

          <button
            className="new-booking-button"
            onClick={() => navigate("/slots")}
          >
            <span>+</span>
            New Booking
          </button>

        </section>


        {/* LOADING */}
        {loading && (
          <section className="empty-bookings">

            <div className="empty-bookings-visual">
              <div className="empty-icon">
                P
              </div>
            </div>

            <span className="empty-eyebrow">
              NEXUSPARK
            </span>

            <h2>
              Loading your bookings...
            </h2>

            <p>
              Please wait while we fetch your parking
              reservation history.
            </p>

          </section>
        )}


        {/* ERROR */}
        {!loading && error && (
          <section className="empty-bookings">

            <div className="empty-bookings-visual">
              <div className="empty-icon">
                !
              </div>
            </div>

            <span className="empty-eyebrow">
              SOMETHING WENT WRONG
            </span>

            <h2>
              Unable to load bookings
            </h2>

            <p>
              {error}
            </p>

            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
              <span>↻</span>
            </button>

          </section>
        )}


        {/* BOOKING COUNT */}
        {!loading && !error && bookings.length > 0 && (
          <div className="booking-count-bar">

            <div className="booking-count-info">

              <div className="booking-count-icon">
                P
              </div>

              <div>
                <strong>
                  {bookings.length}{" "}
                  {bookings.length === 1
                    ? "Booking"
                    : "Bookings"}
                </strong>

                <span>
                  Your parking reservation history
                </span>
              </div>

            </div>

            <div className="booking-count-status">
              <span></span>
              Active Reservations
            </div>

          </div>
        )}


        {/* NO BOOKINGS */}
        {!loading && !error && bookings.length === 0 ? (

          <section className="empty-bookings">

            <div className="empty-bookings-visual">

              <div className="empty-icon">
                P
              </div>

              <div className="empty-circle circle-one"></div>
              <div className="empty-circle circle-two"></div>

            </div>

            <span className="empty-eyebrow">
              YOUR PARKING JOURNEY
            </span>

            <h2>
              No bookings yet
            </h2>

            <p>
              You haven't made any parking reservations.
              Find an available slot at Nexus Mall and
              reserve it in just a few steps.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/slots")}
            >
              Find Parking
              <span>→</span>
            </button>

          </section>

        ) : !loading && !error ? (

          /* BOOKINGS LIST */
          <section className="bookings-list">

            {bookings.map((booking, index) => (

              <article
                className="booking-card"
                key={booking.booking_id || index}
              >

                {/* LEFT */}
                <div className="booking-card-main">

                  <div className="booking-slot-display">

                    <span className="slot-label">
                      SLOT
                    </span>

                    <strong>
                      {booking.slot_number ||
                        booking.slot_id ||
                        "—"}
                    </strong>

                  </div>


                  <div className="booking-card-info">

                    <div className="booking-status">

                      <span></span>

                      {booking.status ||
                        "CONFIRMED"}

                    </div>

                    <h3>
                      Nexus Mall
                    </h3>

                    <div className="booking-meta">

                      <span>
                        📅{" "}
                        {booking.booking_date || "—"}
                      </span>

                      <span>
                        ◷{" "}
                        {booking.start_time || "—"}
                        {" – "}
                        {booking.end_time || "—"}
                      </span>

                    </div>

                    <div className="booking-vehicle">

                      <span>
                        🚗
                      </span>

                      Vehicle:
                      {" "}

                      <strong>
                        {booking.vehicle_number || "—"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* RIGHT */}
                <div className="booking-card-payment">

                  <div className="booking-payment-item">

                    <span>
                      BOOKING ID
                    </span>

                    <strong>
                      {booking.booking_id || "—"}
                    </strong>

                  </div>


                  <div className="booking-payment-divider"></div>


                  <div className="booking-payment-item">

                    <span>
                      AMOUNT PAID
                    </span>

                    <strong className="booking-amount">
                      ₹
                      {booking.total_amount || 0}
                    </strong>

                  </div>

                </div>

              </article>

            ))}

          </section>

        ) : null}


        {/* BOTTOM CTA */}
        {!loading && !error && bookings.length > 0 && (
          <section className="bookings-bottom-cta">

            <div>

              <span className="cta-small-label">
                NEED ANOTHER SPACE?
              </span>

              <h2>
                Plan your next visit to Nexus Mall.
              </h2>

            </div>

            <button
              className="primary-btn"
              onClick={() => navigate("/slots")}
            >
              Find Parking
              <span>→</span>
            </button>

          </section>
        )}

      </main>

    </div>
  );
}

export default MyBookings;