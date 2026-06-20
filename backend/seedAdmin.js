// One-time script to create a default admin account.
// Run with: node seedAdmin.js
// Default credentials (CHANGE THESE before/after running in any real deployment):
//   email:    admin@example.com
//   password: Admin@12345

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const DEFAULT_NAME = 'Admin';
const DEFAULT_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'Admin@12345';

async function seed() {
  try {
    const [existing] = await pool.query('SELECT id FROM admins WHERE email = ?', [DEFAULT_EMAIL]);

    if (existing.length > 0) {
      console.log(`Admin already exists with email: ${DEFAULT_EMAIL}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [DEFAULT_NAME, DEFAULT_EMAIL, hashedPassword]
    );

    console.log('Default admin created successfully:');
    console.log(`  Email:    ${DEFAULT_EMAIL}`);
    console.log(`  Password: ${DEFAULT_PASSWORD}`);
    console.log('IMPORTANT: Log in and change this password immediately, especially in production.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
