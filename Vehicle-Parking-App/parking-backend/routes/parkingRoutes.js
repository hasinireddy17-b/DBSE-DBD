const express = require("express");
const db = require("../db");

const router = express.Router();


/* =========================
   GET ALL PARKING AREAS
========================= */

router.get("/areas", (req, res) => {

  const sql = `
    SELECT
      area_id,
      area_name,
      location,
      total_slots,
      available_slots,
      price_per_hour
    FROM parking_areas
    ORDER BY area_id
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to load parking areas"
      });
    }

    res.json({
      success: true,
      areas: results
    });

  });
});


/* =========================
   GET ONE PARKING AREA
========================= */

router.get("/areas/:areaId", (req, res) => {

  const { areaId } = req.params;

  const sql = `
    SELECT
      area_id,
      area_name,
      location,
      total_slots,
      available_slots,
      price_per_hour
    FROM parking_areas
    WHERE area_id = ?
  `;

  db.query(sql, [areaId], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to load parking area"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parking area not found"
      });
    }

    res.json({
      success: true,
      area: results[0]
    });

  });
});


/* =========================
   GET PARKING STATUS
========================= */

router.get("/areas/:areaId/status", (req, res) => {

  const { areaId } = req.params;

  const sql = `
    SELECT
      pa.area_id,
      pa.area_name,
      pa.location,
      pa.price_per_hour,
      COUNT(ps.slot_id) AS total_slots,
      SUM(
        CASE
          WHEN ps.status = 'AVAILABLE' THEN 1
          ELSE 0
        END
      ) AS available_slots,
      SUM(
        CASE
          WHEN ps.status = 'BOOKED' THEN 1
          ELSE 0
        END
      ) AS booked_slots
    FROM parking_areas pa
    LEFT JOIN parking_slots ps
      ON pa.area_id = ps.area_id
    WHERE pa.area_id = ?
    GROUP BY
      pa.area_id,
      pa.area_name,
      pa.location,
      pa.price_per_hour
  `;

  db.query(sql, [areaId], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to load parking status"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parking area not found"
      });
    }

    res.json({
      success: true,
      status: results[0]
    });

  });
});


/* =========================
   GET SLOTS OF AN AREA
========================= */

router.get("/areas/:areaId/slots", (req, res) => {

  const { areaId } = req.params;

  const sql = `
    SELECT
      slot_id,
      area_id,
      slot_number,
      vehicle_type,
      status
    FROM parking_slots
    WHERE area_id = ?
    ORDER BY slot_id
  `;

  db.query(sql, [areaId], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to load parking slots"
      });
    }

    res.json({
      success: true,
      slots: results
    });

  });
});


/* =========================
   GET AVAILABLE SLOTS
========================= */

router.get("/areas/:areaId/available-slots", (req, res) => {

  const { areaId } = req.params;

  const sql = `
    SELECT
      slot_id,
      area_id,
      slot_number,
      vehicle_type,
      status
    FROM parking_slots
    WHERE area_id = ?
    AND status = 'AVAILABLE'
    ORDER BY slot_id
  `;

  db.query(sql, [areaId], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to load available slots"
      });
    }

    res.json({
      success: true,
      slots: results
    });

  });
});


module.exports = router;