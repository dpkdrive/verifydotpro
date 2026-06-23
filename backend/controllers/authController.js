const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// One-time setup route to create the first admin account.
// You should disable/remove this route (or protect it) after creating your admin.
async function registerAdmin(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const [existing] = await pool.query(
      "SELECT id FROM admins WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "An admin with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    return res
      .status(201)
      .json({ message: "Admin account created successfully." });
  } catch (err) {
    console.error("registerAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Server error while creating admin." });
  }
}

async function loginAdmin(req, res) {
  try {
    let { email, password } = req.body;

    console.log("======================================");
    console.log("LOGIN REQUEST RECEIVED");

    // Normalize input
    email = email?.trim().toLowerCase();
    password = password?.trim();

    console.log("Request Body:", {
      email,
      passwordLength: password ? password.length : 0,
    });

    if (!email || !password) {
      console.log("Email or Password missing");
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find admin
    const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);

    console.log("Rows Found:", rows.length);

    if (rows.length === 0) {
      console.log("Admin not found for email:", email);
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const admin = rows[0];

    console.log("Database Email:", admin.email);
    console.log("Database Name:", admin.name);

    // Compare password
    const passwordMatches = await bcrypt.compare(password, admin.password);

    console.log("Password Match:", passwordMatches);

    if (!passwordMatches) {
      console.log("Password verification failed");
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    console.log("Generating JWT...");

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      },
    );

    console.log("Login Success");
    console.log("======================================");

    return res.json({
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("======================================");
    console.error("LOGIN ERROR");
    console.error(err);
    console.error("======================================");

    return res.status(500).json({
      message: "Server error during login.",
    });
  }

  const path = require("path");

  console.log("Current Working Directory:", process.cwd());
  console.log("DB Path:", path.join(__dirname, "../database.sqlite"));
}

async function getProfile(req, res) {
  // req.admin is set by the auth middleware after verifying the JWT
  return res.json({ admin: req.admin });
}

module.exports = { registerAdmin, loginAdmin, getProfile };
