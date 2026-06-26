import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("adminToken");
  const adminName = localStorage.getItem("adminName");

  const navItems = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: "Verify Authenticity",
      path: "/verify",
    },
    {
      name: "Our Products",
      path: "/products",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => setIsOpen(false)}
        >
          <span className="brand-shield">🛡️</span>
          MYODROL
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={isOpen ? "bar active" : "bar"}></span>
          <span className={isOpen ? "bar active" : "bar"}></span>
          <span className={isOpen ? "bar active" : "bar"}></span>
        </button>

        {/* Navigation */}
        <div className={`navbar-links ${isOpen ? "open" : ""}`}>

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`navbar-link ${isActive(item.path) ? "active" : ""
                }`}
            >
              {item.name}
            </Link>
          ))}

          {token ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className={`navbar-link ${isActive("/admin/dashboard") ? "active" : ""
                  }`}
              >
                Dashboard ({adminName})
              </Link>

              <button
                className="navbar-btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className={`navbar-link ${isActive("/admin/login") ? "active" : ""
                }`}
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}