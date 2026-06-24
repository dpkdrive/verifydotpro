require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
// Trust proxy added on 22-Jun-2026 for Railway/Cloudflare rate limiting
app.set("trust proxy", 1);

const allowedOrigins = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
).split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serve uploaded product images statically
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://[IP_ADDRESS]:${PORT}`),
);
