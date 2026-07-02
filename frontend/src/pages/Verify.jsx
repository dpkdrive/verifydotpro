import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

import logoIcon from "../assets/images/logo.png"

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
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="mx-auto max-w-2xl">

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-2xl backdrop-blur-sm">

          {/* Header */}
          <div className="border-b border-slate-800 bg-black p-4 text-center">

            <div className="mx-auto mb-5 flex  items-center justify-center rounded-full p-2">
              <img src={logoIcon} alt="" style={{ maxWidth: '100px' }} className='' />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Check Authenticity
            </h1>

            <p className="mt-3 text-slate-400">
              Verify your product is genuine using the unique verification code.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8"
          >

            {/* Full Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Product Code */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Product Code
              </label>

              <input
                name="productCode"
                value={form.productCode}
                onChange={handleChange}
                required
                placeholder="Located on the product packaging"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Product →"}
            </button>

          </form>

          {/* Error */}

          {error && (
            <div className="mx-8 mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
              {error}
            </div>
          )}

          {/* Result */}

          {result && (
            <div
              className={`mx-8 mb-6 rounded-xl border px-5 py-4 font-medium ${result.status === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : result.status === "warning"
                  ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
            >
              {result.message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
