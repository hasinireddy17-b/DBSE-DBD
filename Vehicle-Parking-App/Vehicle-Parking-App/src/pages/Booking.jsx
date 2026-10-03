import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { createBooking } from "../services/api";

function Booking() {
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [totalAmount, setTotalAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pricePerHour = 40;

  // Get selected slot from localStorage
  useEffect(() => {
    const storedSlot = localStorage.getItem("selectedSlot");

    if (!storedSlot) {
      navigate("/slots");
      return;
    }

    setSelectedSlot(JSON.parse(storedSlot));
  }, [navigate]);

  // Calculate parking duration and total amount
  useEffect(() => {
    if (!startTime || !endTime) {
      setTotalAmount(0);
      return;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (end <= start) {
      setTotalAmount(0);
      return;
    }

    const difference = end - start;
    const hours = difference / (1000 * 60 * 60);

    setTotalAmount(Math.ceil(hours) * pricePerHour);
  }, [startTime, endTime]);

  // Create booking
  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!selectedSlot) {
      setError("Please select a parking slot.");
      return;
    }

    if (!vehicleNumber || !bookingDate || !startTime || !endTime) {
      setError("Please fill all booking details.");
      return;
    }

    if (totalAmount <= 0) {
      setError("Please select a valid start and end time.");
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        user_id: user.user_id,
        slot_id: selectedSlot.slot_id,
        vehicle_number: vehicleNumber,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_amount: totalAmount,
      };

      const data = await createBooking(bookingData);

      if (data.success) {
        // Save backend booking
        localStorage.setItem(
          "currentBooking",
          JSON.stringify(data.booking)
        );

        // Remove selected slot after booking is created
        localStorage.removeItem("selectedSlot");

        // Go to payment
        navigate("/payment");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);

      setError("Unable to connect to the booking server.");
    }

    setLoading(false);
  };

  // Loading state
  if (!selectedSlot) {
    return (
      <>
        <Navbar />

        <main className="booking-page">
          <div className="booking-loading">
            <div className="loading-spinner"></div>
            <p>Loading booking details...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="booking-page">

        {/* HEADER */}
        <section className="booking-header">

          <div className="booking-badge">
            <span className="booking-badge-dot"></span>
            RESERVE YOUR SPACE
          </div>

          <h1>
            Complete Your <span>Booking</span>
          </h1>

          <p>
            Reserve your parking space at Nexus Mall in just a few steps.
          </p>

        </section>


        {/* PROGRESS */}
        <div className="booking-progress">

          <div className="progress-step completed">
            <div className="progress-number">✓</div>
            <span>Select Slot</span>
          </div>

          <div className="progress-line active"></div>

          <div className="progress-step active">
            <div className="progress-number">2</div>
            <span>Booking Details</span>
          </div>

          <div className="progress-line"></div>

          <div className="progress-step">
            <div className="progress-number">3</div>
            <span>Payment</span>
          </div>

        </div>


        {/* MAIN BOOKING AREA */}
        <section className="booking-layout">

          {/* SELECTED SLOT CARD */}
          <div className="booking-summary-card">

            <div className="booking-card-header">

              <div>
                <span className="card-eyebrow">
                  YOUR SELECTION
                </span>

                <h2>Parking Slot</h2>
              </div>

              <div className="slot-confirmed-badge">
                <span>✓</span>
                Selected
              </div>

            </div>


            <div className="selected-slot-display">

              <div className="slot-visual">

                <div className="slot-visual-top">
                  <span>PARKING</span>
                  <span>EV</span>
                </div>

                <strong>
                  {selectedSlot.slot_number}
                </strong>

                <div className="slot-visual-bottom">
                  {selectedSlot.vehicle_type || "CAR"}
                </div>

              </div>

            </div>


            <div className="selected-slot-details">

              <div className="slot-detail-item">
                <span className="detail-icon">📍</span>

                <div>
                  <small>Location</small>
                  <strong>Nexus Mall</strong>
                </div>
              </div>


              <div className="slot-detail-item">
                <span className="detail-icon">🚗</span>

                <div>
                  <small>Vehicle Type</small>
                  <strong>
                    {selectedSlot.vehicle_type || "Car"}
                  </strong>
                </div>
              </div>


              <div className="slot-detail-item">
                <span className="detail-icon">₹</span>

                <div>
                  <small>Parking Rate</small>
                  <strong>₹{pricePerHour}/hour</strong>
                </div>
              </div>

            </div>


            <div className="booking-note">
              <span>💡</span>

              <p>
                Your selected slot will be reserved after successful
                booking and payment.
              </p>
            </div>

          </div>


          {/* BOOKING FORM */}
          <div className="booking-form-card">

            <div className="booking-form-header">

              <span className="card-eyebrow">
                BOOKING INFORMATION
              </span>

              <h2>Enter Your Details</h2>

              <p>
                Provide your vehicle and parking duration details.
              </p>

            </div>


            <form onSubmit={handleBooking}>

              {/* VEHICLE NUMBER */}
              <div className="form-field">

                <label htmlFor="vehicleNumber">
                  Vehicle Number
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">🚗</span>

                  <input
                    id="vehicleNumber"
                    type="text"
                    placeholder="e.g. TS09AB1234"
                    value={vehicleNumber}
                    onChange={(e) =>
                      setVehicleNumber(
                        e.target.value.toUpperCase()
                      )
                    }
                    required
                  />

                </div>

              </div>


              {/* BOOKING DATE */}
              <div className="form-field">

                <label htmlFor="bookingDate">
                  Booking Date
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">📅</span>

                  <input
                    id="bookingDate"
                    type="date"
                    value={bookingDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setBookingDate(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {/* TIME */}
              <div className="time-section">

                <div className="time-section-heading">
                  <span>⏱</span>
                  <span>Parking Duration</span>
                </div>


                <div className="time-row">

                  <div className="form-field">

                    <label htmlFor="startTime">
                      Start Time
                    </label>

                    <div className="input-wrapper">

                      <span className="input-icon">◷</span>

                      <input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) =>
                          setStartTime(e.target.value)
                        }
                        required
                      />

                    </div>

                  </div>


                  <div className="time-arrow">
                    →
                  </div>


                  <div className="form-field">

                    <label htmlFor="endTime">
                      End Time
                    </label>

                    <div className="input-wrapper">

                      <span className="input-icon">◷</span>

                      <input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                          setEndTime(e.target.value)
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* TOTAL AMOUNT */}
              <div className="booking-total-card">

                <div className="total-left">

                  <span className="total-icon">
                    ₹
                  </span>

                  <div>
                    <span>Total Parking Fee</span>

                    <small>
                      ₹{pricePerHour} × parking hours
                    </small>
                  </div>

                </div>


                <strong>
                  ₹{totalAmount}
                </strong>

              </div>


              {/* ERROR */}
              {error && (
                <div className="booking-error">

                  <span>!</span>

                  <p>{error}</p>

                </div>
              )}


              {/* SUBMIT */}
              <button
                type="submit"
                className="booking-submit-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Creating Booking...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <span>→</span>
                  </>
                )}

              </button>


              <p className="secure-payment-note">
                🔒 Secure booking • Payment processed safely
              </p>

            </form>

          </div>

        </section>

      </main>
    </>
  );
}

export default Booking;