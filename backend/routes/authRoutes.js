const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/authController");

const requireAdminAuth = require("../middleware/auth");

// ===============================
// Public Routes
// ===============================

// One-time use to create your first admin
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// ===============================
// Protected Routes
// ===============================

// Get Logged-in Admin Profile
router.get("/me", requireAdminAuth, getProfile);

// Update Name & Email
router.put("/profile", requireAdminAuth, updateProfile);

// Change Password
router.put("/change-password", requireAdminAuth, changePassword);

module.exports = router;