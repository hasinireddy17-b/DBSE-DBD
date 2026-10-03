const express = require("express");
const db = require("../db");

const router = express.Router();


/* =========================
   CREATE PAYMENT
========================= */

router.post("/", (req, res) => {

  const {
    booking_id,
    amount,
    payment_method,
    transaction_id
  } = req.body;


  if (
    !booking_id ||
    amount === undefined ||
    !payment_method
  ) {

    return res.status(400).json({
      success: false,
      message: "Payment details are incomplete"
    });

  }


  // Check booking exists
  db.query(
    "SELECT booking_id FROM bookings WHERE booking_id = ?",
    [booking_id],
    (err, bookings) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }


      if (bookings.length === 0) {

        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });

      }


      const sql = `
        INSERT INTO payments
        (
          booking_id,
          amount,
          payment_method,
          transaction_id,
          payment_status
        )
        VALUES (?, ?, ?, ?, 'SUCCESS')
      `;


      db.query(
        sql,
        [
          booking_id,
          amount,
          payment_method,
          transaction_id || null
        ],
        (err, result) => {

          if (err) {
            console.error(err);

            return res.status(500).json({
              success: false,
              message: "Payment failed"
            });
          }


          res.status(201).json({

            success: true,

            message: "Payment successful",

            payment: {
              payment_id: result.insertId,
              booking_id,
              amount,
              payment_method,
              transaction_id: transaction_id || null,
              payment_status: "SUCCESS"
            }

          });

        }
      );

    }
  );

});


/* =========================
   GET PAYMENT FOR BOOKING
========================= */

router.get("/booking/:bookingId", (req, res) => {

  const { bookingId } = req.params;


  const sql = `
    SELECT *
    FROM payments
    WHERE booking_id = ?
    ORDER BY payment_id DESC
  `;


  db.query(
    sql,
    [bookingId],
    (err, results) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Failed to load payment"
        });
      }


      res.json({
        success: true,
        payments: results
      });

    }
  );

});


module.exports = router;