const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

(async () => {
  try {
    console.log("======================================");
    console.log("Connecting to MySQL Database...");
    console.log("Host:", process.env.DB_HOST);
    console.log("Database:", process.env.DB_NAME);
    console.log("User:", process.env.DB_USER);
    console.log("Port:", process.env.DB_PORT);
    console.log("======================================");

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test Connection
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    conn.release();

    // Create Tables

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE,
        batch_name VARCHAR(100),
        product_name VARCHAR(150),
        status VARCHAR(30) DEFAULT 'unused',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150),
        email VARCHAR(150),
        phone VARCHAR(30),
        product_code VARCHAR(50),
        result VARCHAR(50),
        ip_address VARCHAR(50),
        checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150),
        description TEXT,
        price DECIMAL(10,2),
        image_url VARCHAR(500),
        demo_code VARCHAR(100)
      )
    `);

    console.log("✅ All MySQL Tables Ready");
  } catch (err) {
    console.error("❌ MySQL Connection Failed");
    console.error(err);
  }
})();

module.exports = {
  async query(sql, params) {
    return pool.query(sql, params);
  },
};
