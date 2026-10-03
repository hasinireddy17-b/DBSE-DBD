import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

function Confirmation() {
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const storedBooking =
      localStorage.getItem("latestBooking");

    console.log(
      "Confirmation data:",
      storedBooking
    );

    if (!storedBooking) {
      navigate("/home");
      return;
    }

    try {
      const parsedData =
        JSON.parse(storedBooking);

      setBookingData(parsedData);
    } catch (error) {
      console.error(
        "Confirmation data error:",
        error
      );

      navigate("/home");
    }
  }, [navigate]);

  if (!bookingData) {
    return (
      <>
        <Navbar />

        <main className="confirmation-page">
          <div className="confirmation-loading">
            <div className="loading-spinner"></div>
            <p>Preparing your confirmation...</p>
          </div>
        </main>
      </>
    );
  }

  // Get booking and payment safely
  const booking =
    bookingData.booking || bookingData;

  const payment =
    bookingData.payment || null;

  return (
    <>
      <Navbar />

      <main className="confirmation-page">

        {/* SUCCESS HEADER */}
        <section className="confirmation-header">

          <div className="success-icon-large">
            ✓
          </div>

          <div className="confirmation-success-badge">
            PAYMENT SUCCESSFUL
          </div>

          <h1>
            Booking <span>Confirmed!</span>
          </h1>

          <p>
            Your parking space at Nexus Mall has been
            successfully reserved.
          </p>

        </section>


        {/* CONFIRMATION CARD */}
        <section className="confirmation-card">

          {/* RECEIPT TOP */}
          <div className="confirmation-card-top">

            <div>

              <span className="card-eyebrow">
                BOOKING CONFIRMATION
              </span>

              <h2>
                Parking Reservation
              </h2>

            </div>

            <div className="confirmed-badge">
              ✓ CONFIRMED
            </div>

          </div>


          {/* BOOKING ID */}
          <div className="confirmation-booking-id">

            <div>
              <span>BOOKING ID</span>

              <strong>
                #{booking.booking_id}
              </strong>
            </div>

            <div className="booking-id-icon">
              P
            </div>

          </div>


          {/* LOCATION */}
          <div className="confirmation-location">

            <div className="location-icon">
              📍
            </div>

            <div>
              <span>Parking Location</span>

              <strong>
                Nexus Mall
              </strong>

              <small>
                Your reserved parking space
              </small>
            </div>

          </div>


          {/* DETAILS GRID */}
          <div className="confirmation-details">

            {/* VEHICLE */}
            <div className="confirmation-detail-card">

              <span className="confirmation-detail-icon">
                🚗
              </span>

              <div>
                <span>Vehicle Number</span>

                <strong>
                  {booking.vehicle_number}
                </strong>
              </div>

            </div>


            {/* SLOT */}
            <div className="confirmation-detail-card">

              <span className="confirmation-detail-icon">
                P
              </span>

              <div>
                <span>Parking Slot</span>

                <strong>
                  {booking.slot_number ||
                    booking.slot_id}
                </strong>
              </div>

            </div>


            {/* DATE */}
            <div className="confirmation-detail-card">

              <span className="confirmation-detail-icon">
                📅
              </span>

              <div>
                <span>Booking Date</span>

                <strong>
                  {booking.booking_date}
                </strong>
              </div>

            </div>


            {/* TIME */}
            <div className="confirmation-detail-card">

              <span className="confirmation-detail-icon">
                ◷
              </span>

              <div>
                <span>Parking Time</span>

                <strong>
                  {booking.start_time} –{" "}
                  {booking.end_time}
                </strong>
              </div>

            </div>

          </div>


          {/* STATUS SECTION */}
          <div className="confirmation-status-section">

            <div className="status-item">

              <span className="status-label">
                Booking Status
              </span>

              <span className="status-success">
                ●{" "}
                {booking.booking_status ||
                  "CONFIRMED"}
              </span>

            </div>


            <div className="status-item">

              <span className="status-label">
                Payment Status
              </span>

              <span className="status-success">
                ●{" "}
                {payment?.payment_status ||
                  "SUCCESS"}
              </span>

            </div>

          </div>


          {/* PAYMENT TOTAL */}
          <div className="confirmation-total">

            <div>

              <span>
                Amount Paid
              </span>

              <small>
                Payment completed successfully
              </small>

            </div>

            <strong>
              ₹
              {payment?.amount ??
                booking.total_amount}
            </strong>

          </div>


          {/* SUCCESS MESSAGE */}
          <div className="confirmation-message">

            <span>✓</span>

            <div>
              <strong>
                You're all set!
              </strong>

              <p>
                Please arrive at Nexus Mall during
                your selected parking time. Keep your
                booking ID handy for reference.
              </p>
            </div>

          </div>


          {/* ACTIONS */}
          <div className="confirmation-actions">

            <button
              className="confirmation-primary-button"
              onClick={() =>
                navigate("/my-bookings")
              }
            >
              View My Bookings
              <span>→</span>
            </button>


            <button
              className="confirmation-secondary-button"
              onClick={() =>
                navigate("/home")
              }
            >
              Back to Home
            </button>

          </div>

        </section>


        {/* FOOTER NOTE */}
        <p className="confirmation-footer-note">
          Thank you for using NexusPark • Smart Parking
          for a smoother parking experience.
        </p>

      </main>
    </>
  );
}

export default Confirmation;