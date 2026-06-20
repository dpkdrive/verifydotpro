import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const adminName = localStorage.getItem('adminName');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-shield">🛡️</span> VerifyPro
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            Verify Authenticity
          </Link>
          <Link to="/products" className={`navbar-link ${isActive('/products') ? 'active' : ''}`}>
            Our Products
          </Link>
          {token ? (
            <div className="navbar-admin-section">
              <Link to="/admin/dashboard" className={`navbar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                Dashboard ({adminName})
              </Link>
              <button onClick={handleLogout} className="navbar-btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className={`navbar-link ${isActive('/admin/login') ? 'active' : ''}`}>
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
