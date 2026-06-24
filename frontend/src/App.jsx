import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Verify from './pages/Verify.jsx';
import Products from './pages/Products.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TestApi from './pages/TestApi.jsx';

function RequireAuth({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/products" element={<Products />} />
        <Route path="/test" element={<TestApi />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        /> */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
