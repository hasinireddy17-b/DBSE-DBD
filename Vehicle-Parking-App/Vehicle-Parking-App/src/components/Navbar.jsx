import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("parkingUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/home" className="logo">
        <div className="logo-mark">
          P
        </div>

        <div className="logo-text">
          <span className="logo-name">NexusPark</span>
          <span className="logo-subtitle">SMART PARKING</span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="nav-links">

        <Link
          to="/home"
          className={location.pathname === "/home" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/live-parking"
          className={location.pathname === "/live-parking" ? "active" : ""}
        >
          Live Parking
        </Link>

        <Link
          to="/my-bookings"
          className={location.pathname === "/my-bookings" ? "active" : ""}
        >
          My Bookings
        </Link>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;