import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { createPayment } from "../services/api";

function Payment() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get current booking
  useEffect(() => {
    const storedBooking = localStorage.getItem("currentBooking");

    if (!storedBooking) {
      navigate("/slots");
      return;
    }

    setBooking(JSON.parse(storedBooking));
  }, [navigate]);

  // Handle payment
  const handlePayment = async () => {
    setError("");

    if (!booking) {
      setError("Booking information not found.");
      return;
    }

    setLoading(true);

    try {
      // Generate demo transaction ID
      const transactionId = "TXN" + Date.now();

      const paymentData = {
        booking_id: booking.booking_id,
        amount: booking.total_amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
      };

      console.log("Payment data:", paymentData);

      const data = await createPayment(paymentData);

      console.log("Payment response:", data);

      if (data.success) {
        // Save payment information
        localStorage.setItem(
          "latestPayment",
          JSON.stringify(data.payment)
        );

        // Save booking + payment
        localStorage.setItem(
          "latestBooking",
          JSON.stringify({
            booking: booking,
            payment: data.payment,
          })
        );

        // Move to confirmation
        navigate("/confirmation");
      } else {
        setError(data.message || "Payment failed.");
      }
    } catch (error) {
      console.error("Payment error:", error);

      setError("Unable to connect to payment server.");
    }

    setLoading(false);
  };

  // Loading state
  if (!booking) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-loading">
            <div className="loading-spinner"></div>
            <p>Loading payment details...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="payment-page">

        {/* HEADER */}
        <section className="payment-header">

          <div className="payment-badge">
            <span className="payment-badge-icon">🔒</span>
            SECURE PAYMENT
          </div>

          <h1>
            Complete Your <span>Payment</span>
          </h1>

          <p>
            Secure your parking reservation at Nexus Mall.
          </p>

        </section>


        {/* PROGRESS */}
        <div className="payment-progress">

          <div className="progress-step completed">
            <div className="progress-number">✓</div>
            <span>Select Slot</span>
          </div>

          <div className="progress-line active"></div>

          <div className="progress-step completed">
            <div className="progress-number">✓</div>
            <span>Booking Details</span>
          </div>

          <div className="progress-line active"></div>

          <div className="progress-step active">
            <div className="progress-number">3</div>
            <span>Payment</span>
          </div>

        </div>


        {/* PAYMENT CONTENT */}
        <section className="payment-layout">

          {/* LEFT - BOOKING SUMMARY */}
          <div className="payment-summary-card">

            <div className="payment-card-heading">

              <div>
                <span className="card-eyebrow">
                  RESERVATION SUMMARY
                </span>

                <h2>Your Booking</h2>
              </div>

              <div className="booking-status-badge">
                ● Reserved
              </div>

            </div>


            {/* BOOKING ID */}
            <div className="booking-id-box">

              <span>BOOKING ID</span>

              <strong>
                #{booking.booking_id}
              </strong>

            </div>


            {/* SUMMARY DETAILS */}
            <div className="payment-summary-details">

              <div className="payment-detail-row">

                <div className="payment-detail-icon">
                  P
                </div>

                <div>
                  <span>Parking Slot</span>

                  <strong>
                    {booking.slot_number || booking.slot_id}
                  </strong>
                </div>

              </div>


              <div className="payment-detail-row">

                <div className="payment-detail-icon">
                  🚗
                </div>

                <div>
                  <span>Vehicle Number</span>

                  <strong>
                    {booking.vehicle_number}
                  </strong>
                </div>

              </div>


              <div className="payment-detail-row">

                <div className="payment-detail-icon">
                  📅
                </div>

                <div>
                  <span>Parking Date</span>

                  <strong>
                    {booking.booking_date}
                  </strong>
                </div>

              </div>


              <div className="payment-detail-row">

                <div className="payment-detail-icon">
                  ◷
                </div>

                <div>
                  <span>Parking Time</span>

                  <strong>
                    {booking.start_time} – {booking.end_time}
                  </strong>
                </div>

              </div>

            </div>


            {/* TOTAL */}
            <div className="payment-total">

              <div>
                <span>Total Amount</span>

                <small>
                  Inclusive parking charges
                </small>
              </div>

              <strong>
                ₹{booking.total_amount}
              </strong>

            </div>

          </div>


          {/* RIGHT - PAYMENT METHOD */}
          <div className="payment-method-card">

            <div className="payment-card-heading">

              <div>
                <span className="card-eyebrow">
                  PAYMENT METHOD
                </span>

                <h2>Choose how to pay</h2>
              </div>

            </div>


            <div className="payment-options">

              {/* UPI */}
              <label
                className={`payment-option-card ${
                  paymentMethod === "UPI"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="payment-option-icon upi-icon">
                  UPI
                </div>

                <div className="payment-option-content">

                  <strong>UPI</strong>

                  <span>
                    Google Pay, PhonePe, Paytm & more
                  </span>

                </div>

                <div className="payment-radio">
                  {paymentMethod === "UPI" && "✓"}
                </div>

              </label>


              {/* CARD */}
              <label
                className={`payment-option-card ${
                  paymentMethod === "CARD"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="payment-option-icon card-icon">
                  ▣
                </div>

                <div className="payment-option-content">

                  <strong>
                    Credit / Debit Card
                  </strong>

                  <span>
                    Visa, Mastercard & other cards
                  </span>

                </div>

                <div className="payment-radio">
                  {paymentMethod === "CARD" && "✓"}
                </div>

              </label>


              {/* CASH */}
              <label
                className={`payment-option-card ${
                  paymentMethod === "CASH"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="payment-option-icon cash-icon">
                  ₹
                </div>

                <div className="payment-option-content">

                  <strong>
                    Cash
                  </strong>

                  <span>
                    Pay at the parking counter
                  </span>

                </div>

                <div className="payment-radio">
                  {paymentMethod === "CASH" && "✓"}
                </div>

              </label>

            </div>


            {/* ERROR */}
            {error && (
              <div className="payment-error">

                <span>!</span>

                <p>{error}</p>

              </div>
            )}


            {/* PAY BUTTON */}
            <button
              className="payment-button"
              onClick={handlePayment}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay ₹{booking.total_amount}
                  <span>→</span>
                </>
              )}

            </button>


            {/* SECURITY MESSAGE */}
            <div className="payment-security">

              <span>🔒</span>

              <div>
                <strong>Secure Payment</strong>

                <p>
                  Your payment information is securely
                  processed and protected.
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}

export default Payment;