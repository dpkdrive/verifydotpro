const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const requireAdminAuth = require('../middleware/auth');
const { uploadSingle, optimizeImage } = require('../middleware/upload');
const {
  verifyProduct,
  createCodes,
  listCodes,
  listLogs,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Protect the public verify endpoint from brute-force code guessing
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 verification attempts per window
  message: { message: 'Too many verification attempts. Please try again later.' },
});

// Public
router.post('/verify', verifyLimiter, verifyProduct);
router.get('/', listProducts);

// Admin only (codes & logs)
router.post('/codes', requireAdminAuth, createCodes);
router.get('/codes', requireAdminAuth, listCodes);
router.get('/logs', requireAdminAuth, listLogs);

// Admin only (products CRUD)
router.post('/', requireAdminAuth, uploadSingle, optimizeImage, createProduct);
router.put('/:id', requireAdminAuth, uploadSingle, optimizeImage, updateProduct);
router.delete('/:id', requireAdminAuth, deleteProduct);

module.exports = router;

