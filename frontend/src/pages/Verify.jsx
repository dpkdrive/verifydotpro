import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

export default function Verify() {
  const location = useLocation();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', productCode: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.code) {
      setForm((prev) => ({ ...prev, productCode: location.state.code }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.post('/products/verify', form);
      setResult(res.data);
    } catch (err) {
      if (err.response?.data) {
        setResult(err.response.data);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Check Authenticity</h1>
        <p className="muted">Verify your product is genuine</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />

          <label>Email Address</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />

          <label>Product Code</label>
          <input
            name="productCode"
            value={form.productCode}
            onChange={handleChange}
            placeholder="Located on the product packaging"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify Product →'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className={`result ${result.status || ''}`}>
            {result.message}
          </div>
        )}

        <p className="muted" style={{ marginTop: 24, textAlign: 'center' }}>
          <a className="link" href="/admin/login">Admin Login</a>
        </p>
      </div>
    </div>
  );
}
