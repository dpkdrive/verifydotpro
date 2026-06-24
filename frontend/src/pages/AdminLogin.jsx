import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);
  //   try {
  //     const res = await api.post('/auth/login', form);
  //     localStorage.setItem('adminToken', res.data.token);
  //     localStorage.setItem('adminName', res.data.admin.name);
  //     navigate('/admin/dashboard');
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Login failed.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN RESPONSE", res.data);

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.admin.name);

      console.log("Saved Token:", localStorage.getItem("adminToken"));

      navigate("/admin/dashboard");

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Admin Login</h1>
        <p className="muted">Sign in to manage product codes</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <p className="muted" style={{ marginTop: 24, textAlign: 'center' }}>
          <a className="link" href="/">Back to verification page</a>
        </p>
      </div>
    </div>
  );
}
