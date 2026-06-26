import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AdminProfile.css";

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

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        <>
            <div className="profile-page">

                <div className="profile-container">

                    <div className="profile-header">

                        <h2>

                            Account Settings

                        </h2>

                        <p>

                            Manage your profile information
                            and account security.

                        </p>

                    </div>



                    {message && (

                        <div className="success-box">

                            {message}

                        </div>

                    )}



                    {error && (

                        <div className="error-box">

                            {error}

                        </div>

                    )}



                    {/* ======================================

                    PROFILE FORM

                ====================================== */}

                    <div className="profile-card">

                        <h3>

                            👤 Profile Information

                        </h3>

                        <form onSubmit={handleProfileSubmit}>

                            <div className="form-group">
                                <label>Full Name</label>

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
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>

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
                                />
                            </div>

                            <button
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Updating..."
                                    : "Update Profile"}
                            </button>

                        </form>

                    </div>





                    {/* ==========================
                        PASSWORD CARD
                =========================== */}

                    <div className="profile-card">

                        <h3>

                            🔒 Change Password

                        </h3>

                        <form onSubmit={handlePasswordSubmit}>

                            <div className="form-group">

                                <label>

                                    Current Password

                                </label>

                                <div className="password-wrapper">

                                    <input

                                        type={
                                            showPassword.current
                                                ? "text"
                                                : "password"
                                        }

                                        required

                                        disabled={loading}

                                        value={
                                            password.currentPassword
                                        }

                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                currentPassword:
                                                    e.target.value,
                                            })
                                        }

                                        placeholder="Current Password"

                                    />

                                    <span

                                        className="eye-btn"

                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                current: !showPassword.current,
                                            })
                                        }

                                    >

                                        {showPassword.current
                                            ? "🙈"
                                            : "👁"}

                                    </span>

                                </div>

                            </div>





                            <div className="form-group">

                                <label>

                                    New Password

                                </label>

                                <div className="password-wrapper">

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

                                                newPassword:
                                                    e.target.value,

                                            });

                                            checkStrength(
                                                e.target.value
                                            );

                                        }}

                                        placeholder="New Password"

                                    />

                                    <span

                                        className="eye-btn"

                                        onClick={() =>
                                            setShowPassword({

                                                ...showPassword,

                                                next:
                                                    !showPassword.next,

                                            })
                                        }

                                    >

                                        {showPassword.next
                                            ? "🙈"
                                            : "👁"}

                                    </span>

                                </div>

                            </div>





                            {

                                password.newPassword &&

                                <div className={`strength ${passwordStrength.toLowerCase()}`}>

                                    Password Strength :

                                    <strong>

                                        {passwordStrength}

                                    </strong>

                                </div>

                            }





                            <div className="form-group">

                                <label>

                                    Confirm Password

                                </label>

                                <div className="password-wrapper">

                                    <input

                                        type={
                                            showPassword.confirm
                                                ? "text"
                                                : "password"
                                        }

                                        required

                                        disabled={loading}

                                        value={
                                            password.confirmPassword
                                        }

                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                confirmPassword:
                                                    e.target.value,
                                            })
                                        }

                                        placeholder="Confirm Password"

                                    />

                                    <span

                                        className="eye-btn"

                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                confirm:
                                                    !showPassword.confirm,
                                            })
                                        }

                                    >

                                        {showPassword.confirm
                                            ? "🙈"
                                            : "👁"}

                                    </span>

                                </div>

                            </div>





                            {

                                password.confirmPassword &&

                                <div
                                    className={
                                        password.newPassword ===
                                            password.confirmPassword
                                            ? "match success-text"
                                            : "match error-text"
                                    }
                                >

                                    {

                                        password.newPassword ===
                                            password.confirmPassword

                                            ? "✔ Password matched"

                                            : "✖ Password does not match"

                                    }

                                </div>

                            }





                            <button

                                className="btn-primary"

                                disabled={loading}

                            >

                                {

                                    loading

                                        ? "Updating..."

                                        : "Change Password"

                                }

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </>
    );
}

