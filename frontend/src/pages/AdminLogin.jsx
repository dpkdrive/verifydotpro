import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, Mail, Lock } from "lucide-react";
import logoIcon from "../assets/images/logo.png"
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
      // alert("Token Saved");
      // console.log("Saved Token:", localStorage.getItem("adminToken"));


      navigate("/admin/dashboard");

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="mx-auto max-w-md">

        {/* Login Card */}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-sm">

          {/* Header */}

          <div className="border-b border-slate-800 bg-gradient-to-r from-red-950/60 to-orange-950/40 p-8 text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 shadow-lg">

              <ShieldCheck className="text-white" size={34} />
              <img src={logoIcon} alt="" style={{ maxWidth: '100px' }} className='rounded-full ' />

            </div>

            <h1 className="text-3xl font-bold text-white">
              Admin Login
            </h1>

            <p className="mt-3 text-slate-400">
              Sign in to manage product authentication and verification codes.
            </p>

          </div>

          {/* Login Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />

              </div>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          {/* Error */}

          {error && (

            <div className="mx-8 mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">

              {error}

            </div>

          )}

          {/* Footer */}

          <div className="border-t border-slate-800 bg-slate-950/50 px-8 py-6 text-center">

            <p className="text-sm text-slate-500">

              Return to product verification

            </p>

            <a
              href="/"
              className="mt-2 inline-block font-medium text-red-400 transition hover:text-red-300"
            >
              ← Back to Verification Page
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}
