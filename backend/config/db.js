const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;
let isSQLite = false;

// Fall back to SQLite if DB_TYPE is sqlite or if no mysql details are configured
if (process.env.DB_TYPE === 'sqlite' || !process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'your_mysql_password') {
  isSQLite = true;
}

if (isSQLite) {
  console.log('Using SQLite database (fallback/default)...');
  const { DatabaseSync } = require('node:sqlite');
  const path = require('path');
  const dbPath = path.join(__dirname, '../database.sqlite');
  const sqliteDb = new DatabaseSync(dbPath);

  // Initialize SQLite schema
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      batch_name TEXT,
      product_name TEXT,
      status TEXT DEFAULT 'unused',
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      product_code TEXT NOT NULL,
      result TEXT NOT NULL,
      ip_address TEXT,
      checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      image_url TEXT,
      demo_code TEXT
    );
  `);

  // Seed products and codes if empty
  const productCount = sqliteDb.prepare("SELECT COUNT(*) as count FROM products").get();
  if (productCount.count === 0) {
    console.log('Seeding dummy products and demo codes...');
    const insertProduct = sqliteDb.prepare(`
      INSERT INTO products (name, description, price, image_url, demo_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertCode = sqliteDb.prepare(`
      INSERT OR IGNORE INTO product_codes (code, batch_name, product_name)
      VALUES (?, ?, ?)
    `);

    const dummyProducts = [
      {
        name: 'AeroPulse',
        description: 'Premium active noise-cancelling wireless headphones.',
        price: 299.99,
        image_url: 'https://insane-genix.com/wp-content/uploads/2026/02/RP6.png',
        demo_code: 'AP-ANC-9901'
      },
      {
        name: 'Leaflet',
        description: 'Luxury automatic timepiece with sapphire crystal.',
        price: 1499.00,
        image_url: 'https://insane-genix.com/wp-content/uploads/2026/02/RP6.png',
        demo_code: 'CH-ELT-4812'
      },

    ];

    for (const p of dummyProducts) {
      insertProduct.run(p.name, p.description, p.price, p.image_url, p.demo_code);
      insertCode.run(p.demo_code, 'Seeded Demo Batch', p.name);
    }
  }

  pool = {
    async query(sql, params) {
      // Handle bulk insert format: VALUES ?
      if (sql.includes('VALUES ?') && Array.isArray(params) && Array.isArray(params[0]) && Array.isArray(params[0][0])) {
        const rowsToInsert = params[0];
        const placeholders = rowsToInsert.map(() => '(?, ?, ?, ?)').join(', ');
        const newSql = sql.replace('VALUES ?', `VALUES ${placeholders}`);
        const flatParams = rowsToInsert.flat();
        const stmt = sqliteDb.prepare(newSql);
        const result = stmt.run(...flatParams);
        return [result];
      }

      const trimmedSql = sql.trim().toUpperCase();
      if (trimmedSql.startsWith('SELECT')) {
        const stmt = sqliteDb.prepare(sql);
        const rows = stmt.all(...(params || []));
        return [rows];
      } else {
        const stmt = sqliteDb.prepare(sql);
        const result = stmt.run(...(params || []));
        return [result];
      }
    }
  };
} else {
  console.log('Connecting to MySQL database...');
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

  // Automatically verify & create tables for MySQL if they don't exist
  (async () => {
    try {
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
          code VARCHAR(32) NOT NULL UNIQUE,
          batch_name VARCHAR(100),
          product_name VARCHAR(150),
          status VARCHAR(20) DEFAULT 'unused',
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS verification_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(30) NOT NULL,
          product_code VARCHAR(32) NOT NULL,
          result VARCHAR(50) NOT NULL,
          ip_address VARCHAR(45),
          checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2),
          image_url VARCHAR(255),
          demo_code VARCHAR(100)
        )
      `);
      console.log('MySQL database tables initialized/verified.');
    } catch (err) {
      console.error('MySQL database table initialization failed:', err);
    }
  })();
}

module.exports = pool;

