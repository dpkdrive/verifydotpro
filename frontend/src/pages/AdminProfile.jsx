import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import {

    Lock,
    Eye,
    EyeOff,

} from "lucide-react";

export default function AdminProfile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState({
        current: false,
        next: false,
        confirm: false,
    });

    const [passwordStrength, setPasswordStrength] = useState("");



    // ------------------------------------
    // Auto Hide Alerts
    // ------------------------------------

    useEffect(() => {

        if (!message && !error) return;

        const timer = setTimeout(() => {

            setMessage("");
            setError("");

        }, 3000);

        return () => clearTimeout(timer);

    }, [message, error]);



    // ------------------------------------
    // Load Profile
    // ------------------------------------

    useEffect(() => {

        loadProfile();

    }, []);




    const loadProfile = async () => {

        try {

            const res = await api.get("/auth/me");

            setProfile({

                name: res.data.admin.name || "",

                email: res.data.admin.email || "",

            });

        } catch (err) {

            console.log(err);

            if (err.response?.status === 401) {

                navigate("/admin/login");

            }

        }

    };



    // ------------------------------------
    // Password Strength
    // ------------------------------------

    const checkStrength = (value) => {

        let score = 0;

        if (value.length >= 8) score++;

        if (/[A-Z]/.test(value)) score++;

        if (/[a-z]/.test(value)) score++;

        if (/[0-9]/.test(value)) score++;

        if (/[^A-Za-z0-9]/.test(value)) score++;

        if (score <= 2)
            setPasswordStrength("Weak");

        else if (score <= 4)
            setPasswordStrength("Medium");

        else
            setPasswordStrength("Strong");

    };



    // ------------------------------------
    // Profile Update
    // ------------------------------------

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");
        if (profile.name.trim().length < 2) {
            setError("Name is too short.");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {

            setError("Enter a valid email.");

            setLoading(false);

            return;

        }
        try {

            const res = await api.put(

                "/auth/profile",

                {

                    name: profile.name.trim(),

                    email: profile.email
                        .trim()
                        .toLowerCase(),

                }

            );

            localStorage.setItem(

                "adminToken",

                res.data.token

            );

            localStorage.setItem(

                "adminName",

                res.data.admin.name

            );

            setMessage(res.data.message);

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Profile update failed."

            );

        }

        setLoading(false);

    };
    // ------------------------------------
    // Password Update
    // ------------------------------------

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setMessage("");

        setError("");

        if (

            password.newPassword !==
            password.confirmPassword

        ) {

            setError("Passwords do not match.");

            setLoading(false);

            return;

        }

        try {

            const res = await api.put(

                "/auth/change-password",

                {

                    currentPassword:
                        password.currentPassword.trim(),

                    newPassword:
                        password.newPassword.trim(),

                }

            );

            setMessage(res.data.message);

            setPassword({

                currentPassword: "",

                newPassword: "",

                confirmPassword: "",

            });

            setPasswordStrength("");

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Password update failed."

            );

        }

        setLoading(false);

    };

    return (
        <div className="min-h-screen bg-slate-950 py-10 px-4">
            <div className="mx-auto max-w-6xl">

                {/* ================= Header ================= */}
                <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-white">
                        Account Settings
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Manage your profile information and account security.
                    </p>
                </div>

                {/* ================= Success ================= */}

                {message && (
                    <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-green-400">
                        {message}
                    </div>
                )}

                {/* ================= Error ================= */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
                        {error}
                    </div>
                )}

                {/* ================= Grid ================= */}

                <div className="grid gap-8 lg:grid-cols-2">

                    {/* =====================================================
                    PROFILE INFORMATION
        ====================================================== */}

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">

                        <h3 className="mb-8 text-2xl font-bold text-white">
                            👤 Profile Information
                        </h3>

                        <form
                            onSubmit={handleProfileSubmit}
                            className="space-y-6"
                        >

                            {/* Full Name */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    disabled={loading}
                                    value={profile.name}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                                />
                            </div>

                            {/* Email */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    disabled={loading}
                                    value={profile.email}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                                />
                            </div>

                            {/* Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>

                        </form>

                    </div>

                    {/* =====================================================
                  PASSWORD CARD
            Step-2 me isko Tailwind me convert karenge
        ====================================================== */}

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl flex items-center justify-center">

                        <p className="text-slate-500">
                            Password Section (Step 2)
                        </p>

                    </div>


                    {/* =====================================================
                CHANGE PASSWORD
===================================================== */}

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">

                        <div className="mb-8 flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500">

                                <Lock size={22} className="text-white" />

                            </div>

                            <div>

                                <h3 className="text-2xl font-bold text-white">

                                    Change Password

                                </h3>

                                <p className="text-sm text-slate-400">

                                    Update your account password securely.

                                </p>

                            </div>

                        </div>

                        <form
                            onSubmit={handlePasswordSubmit}
                            className="space-y-6"
                        >

                            {/* Current Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    Current Password

                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword.current
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        disabled={loading}
                                        value={password.currentPassword}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Current Password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                current: !showPassword.current,
                                            })
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >

                                        {showPassword.current ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                            </div>

                            {/* New Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    New Password

                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword.next
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        disabled={loading}
                                        value={password.newPassword}
                                        onChange={(e) => {

                                            setPassword({
                                                ...password,
                                                newPassword: e.target.value,
                                            });

                                            checkStrength(e.target.value);

                                        }}
                                        placeholder="New Password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                next: !showPassword.next,
                                            })
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >

                                        {showPassword.next ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                            </div>

                            {/* Password Strength */}

                            {password.newPassword && (

                                <div
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${passwordStrength === "Strong"
                                        ? "border-green-500/20 bg-green-500/10 text-green-400"
                                        : passwordStrength === "Medium"
                                            ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                            : "border-red-500/20 bg-red-500/10 text-red-400"
                                        }`}
                                >

                                    Password Strength :

                                    <strong className="ml-2">

                                        {passwordStrength}

                                    </strong>

                                </div>

                            )}

                            {/* Confirm Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    Confirm Password

                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword.confirm
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        disabled={loading}
                                        value={password.confirmPassword}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Confirm Password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                confirm: !showPassword.confirm,
                                            })
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >

                                        {showPassword.confirm ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                            </div>

                            {/* Password Match */}

                            {password.confirmPassword && (

                                <div
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${password.newPassword === password.confirmPassword
                                        ? "border-green-500/20 bg-green-500/10 text-green-400"
                                        : "border-red-500/20 bg-red-500/10 text-red-400"
                                        }`}
                                >

                                    {password.newPassword ===
                                        password.confirmPassword
                                        ? "✔ Password matched"
                                        : "✖ Password does not match"}

                                </div>

                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading
                                    ? "Updating..."
                                    : "Change Password"}

                            </button>

                        </form>

                    </div>

                </div>

            </div>
        </div>
    );
}

