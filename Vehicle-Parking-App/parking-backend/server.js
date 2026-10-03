const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const authRoutes = require("./routes/authRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());


/* =========================
   TEST BACKEND
========================= */

app.get("/", (req, res) => {

  res.json({
    message: "Vehicle Parking Backend is running!"
  });

});


/* =========================
   TEST DATABASE
========================= */

app.get("/api/test-db", (req, res) => {

  db.query(
    "SELECT 1 AS test",
    (err, result) => {

      if (err) {

        console.error("Database error:", err);

        return res.status(500).json({
          success: false,
          message: "Database connection failed",
          error: err.message
        });

      }


      res.json({

        success: true,

        message: "Database connected successfully!",

        result

      });

    }
  );

});


/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/parking", parkingRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payments", paymentRoutes);


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});