const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* =========================
   REGISTER
========================= */

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  try {
    // Check if email already exists
    db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            success: false,
            message: "Database error"
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already registered"
          });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const sql = `
          INSERT INTO users
          (name, email, phone, password)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          sql,
          [name, email, phone || null, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                success: false,
                message: "Registration failed"
              });
            }

            res.status(201).json({
              success: true,
              message: "Registration successful",
              user: {
                user_id: result.insertId,
                name,
                email,
                phone: phone || null
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


/* =========================
   LOGIN
========================= */

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      res.json({
        success: true,
        message: "Login successful",
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    }
  );
});


module.exports = router;