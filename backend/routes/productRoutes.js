const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const requireAdminAuth = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");

const {
  verifyProduct,
  createCodes,
  listCodes,
  listLogs,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Protect the public verify endpoint from brute-force code guessing
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    message: "Too many verification attempts. Please try again later.",
  },
});

// =====================
// Public Routes
// =====================
router.post("/verify", verifyLimiter, verifyProduct);
router.get("/", listProducts);

// =====================
// Admin Routes - Codes & Logs
// =====================
router.post("/codes", requireAdminAuth, createCodes);
router.get("/codes", requireAdminAuth, listCodes);
router.get("/logs", requireAdminAuth, listLogs);

// =====================
// Admin Routes - Products CRUD
// =====================
router.post(
  "/",
  requireAdminAuth,
  uploadSingle,
  createProduct
);

router.put(
  "/:id",
  requireAdminAuth,
  uploadSingle,
  updateProduct
);

router.delete(
  "/:id",
  requireAdminAuth,
  deleteProduct
);

module.exports = router;