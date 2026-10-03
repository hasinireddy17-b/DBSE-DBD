const express = require("express");
const db = require("../db");

const router = express.Router();

/* =========================
   CREATE BOOKING
========================= */

router.post("/", (req, res) => {

  const {
    user_id,
    slot_id,
    vehicle_number,
    booking_date,
    start_time,
    end_time,
    total_amount
  } = req.body;


  // Check required fields
  if (
    !user_id ||
    !slot_id ||
    !vehicle_number ||
    !booking_date ||
    !start_time ||
    !end_time ||
    total_amount === undefined
  ) {

    return res.status(400).json({
      success: false,
      message: "Please provide all booking details"
    });

  }


  // First check whether the slot exists and is available
  db.query(
    `SELECT *
     FROM parking_slots
     WHERE slot_id = ?
     AND status = 'AVAILABLE'`,
    [slot_id],
    (err, slots) => {

      if (err) {

        console.error("Slot check error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message
        });

      }


      if (slots.length === 0) {

        return res.status(400).json({
          success: false,
          message: "This parking slot is not available"
        });

      }


      // Get area_id from the selected parking slot
      const area_id = slots[0].area_id;


      console.log("Selected slot:", slot_id);
      console.log("Area ID:", area_id);


      // Create booking
      const bookingSql = `
        INSERT INTO bookings
        (
          user_id,
          area_id,
          slot_id,
          vehicle_number,
          booking_date,
          start_time,
          end_time,
          total_amount,
          booking_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
      `;


      db.query(
        bookingSql,
        [
          user_id,
          area_id,
          slot_id,
          vehicle_number,
          booking_date,
          start_time,
          end_time,
          total_amount
        ],
        (err, result) => {

          if (err) {

            console.error("Booking insert error:", err);

            return res.status(500).json({
              success: false,
              message: "Booking failed",
              error: err.message
            });

          }


          // Mark selected slot as BOOKED
          db.query(
            `UPDATE parking_slots
             SET status = 'BOOKED'
             WHERE slot_id = ?`,
            [slot_id],
            (err) => {

              if (err) {

                console.error(
                  "Slot update error:",
                  err
                );

                return res.status(500).json({
                  success: false,
                  message:
                    "Booking created but slot status update failed",
                  error: err.message
                });

              }


              // Decrease available slot count
              db.query(
                `UPDATE parking_areas
                 SET available_slots =
                   CASE
                     WHEN available_slots > 0
                     THEN available_slots - 1
                     ELSE 0
                   END
                 WHERE area_id = ?`,
                [area_id],
                (err) => {

                  if (err) {

                    console.error(
                      "Area update error:",
                      err
                    );

                    return res.status(500).json({
                      success: false,
                      message:
                        "Booking created but parking count update failed",
                      error: err.message
                    });

                  }


                  // Everything successful
                  res.status(201).json({

                    success: true,

                    message:
                      "Booking created successfully",

                    booking: {

                      booking_id:
                        result.insertId,

                      user_id:
                        user_id,

                      area_id:
                        area_id,

                      slot_id:
                        slot_id,

                      vehicle_number:
                        vehicle_number,

                      booking_date:
                        booking_date,

                      start_time:
                        start_time,

                      end_time:
                        end_time,

                      total_amount:
                        total_amount,

                      booking_status:
                        "CONFIRMED"

                    }

                  });

                }
              );

            }
          );

        }
      );

    }
  );

});


/* =========================
   GET USER BOOKINGS
========================= */

router.get("/user/:userId", (req, res) => {

  const { userId } = req.params;


  const sql = `
    SELECT
      b.booking_id,
      b.user_id,
      b.area_id,
      b.slot_id,
      b.vehicle_number,
      b.booking_date,
      b.start_time,
      b.end_time,
      b.total_amount,
      b.booking_status,
      b.created_at,

      ps.slot_number,
      ps.vehicle_type,

      pa.area_name,
      pa.location

    FROM bookings b

    LEFT JOIN parking_slots ps
      ON b.slot_id = ps.slot_id

    LEFT JOIN parking_areas pa
      ON b.area_id = pa.area_id

    WHERE b.user_id = ?

    ORDER BY b.booking_id DESC
  `;


  db.query(sql, [userId], (err, results) => {

    if (err) {

      console.error(
        "Get user bookings error:",
        err
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load bookings",
        error: err.message
      });

    }


    res.json({

      success: true,

      bookings: results

    });

  });

});


/* =========================
   GET ONE BOOKING
========================= */

router.get("/:bookingId", (req, res) => {

  const { bookingId } = req.params;


  const sql = `
    SELECT
      b.*,

      ps.slot_number,
      ps.vehicle_type,

      pa.area_name,
      pa.location

    FROM bookings b

    LEFT JOIN parking_slots ps
      ON b.slot_id = ps.slot_id

    LEFT JOIN parking_areas pa
      ON b.area_id = pa.area_id

    WHERE b.booking_id = ?
  `;


  db.query(sql, [bookingId], (err, results) => {

    if (err) {

      console.error(
        "Get booking error:",
        err
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load booking",
        error: err.message
      });

    }


    if (results.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });

    }


    res.json({

      success: true,

      booking: results[0]

    });

  });

});


module.exports = router;