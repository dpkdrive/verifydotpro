const crypto = require('crypto');

const pool = require('../config/db');


function generateCode() {
  // e.g. "A1B2-C3D4-E5F6"
  const raw = crypto.randomBytes(6).toString('hex').toUpperCase();
  return raw.match(/.{1,4}/g).join('-');
}

// ---- PUBLIC: anyone can verify a product code ----
async function verifyProduct(req, res) {
  try {
    const { fullName, email, phone, productCode } = req.body;

    if (!fullName || !email || !phone || !productCode) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const code = productCode.trim().toUpperCase();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const [rows] = await pool.query('SELECT * FROM product_codes WHERE code = ?', [code]);

    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO verification_logs (full_name, email, phone, product_code, result, ip_address)
         VALUES (?, ?, ?, ?, 'fake', ?)`,
        [fullName, email, phone, code, ip]
      );
      return res.status(404).json({
        status: 'fake',
        message: 'This product code is not recognized. The product may not be genuine.',
      });
    }

    const product = rows[0];

    if (product.status === 'verified') {
      await pool.query(
        `INSERT INTO verification_logs (full_name, email, phone, product_code, result, ip_address)
         VALUES (?, ?, ?, ?, 'genuine_already_verified', ?)`,
        [fullName, email, phone, code, ip]
      );
      return res.json({
        status: 'genuine_already_verified',
        message: 'This product is genuine, but its code has already been verified before. If you are not the original buyer, please be cautious.',
        productName: product.product_name,
      });
    }

    // First-time verification: mark as used
    await pool.query("UPDATE product_codes SET status = 'verified' WHERE id = ?", [product.id]);
    await pool.query(
      `INSERT INTO verification_logs (full_name, email, phone, product_code, result, ip_address)
       VALUES (?, ?, ?, ?, 'genuine_first_check', ?)`,
      [fullName, email, phone, code, ip]
    );

    return res.json({
      status: 'genuine_first_check',
      message: 'Congratulations! Your product is genuine.',
      productName: product.product_name,
    });
  } catch (err) {
    console.error('verifyProduct error:', err);
    return res.status(500).json({ message: 'Server error during verification.' });
  }
}

// ---- ADMIN: generate new product code(s) ----
async function createCodes(req, res) {
  try {
    const { productName, batchName, quantity } = req.body;
    const qty = Math.min(Math.max(parseInt(quantity, 10) || 1, 1), 500); // cap at 500 per request

    if (!productName) {
      return res.status(400).json({ message: 'productName is required.' });
    }

    const codes = [];
    for (let i = 0; i < qty; i++) {
      codes.push(generateCode());
    }

    const values = codes.map((code) => [code, batchName || null, productName, req.admin.id]);

    await pool.query(
      'INSERT INTO product_codes (code, batch_name, product_name, created_by) VALUES ?',
      [values]
    );

    return res.status(201).json({ message: `${qty} code(s) generated.`, codes });
  } catch (err) {
    console.error('createCodes error:', err);
    return res.status(500).json({ message: 'Server error while generating codes.' });
  }
}

// ---- ADMIN: list all product codes ----
async function listCodes(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, code, batch_name, product_name, status, created_at FROM product_codes ORDER BY created_at DESC LIMIT 500'
    );
    return res.json({ codes: rows });
  } catch (err) {
    console.error('listCodes error:', err);
    return res.status(500).json({ message: 'Server error while fetching codes.' });
  }
}

// ---- ADMIN: list verification logs ----
async function listLogs(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM verification_logs ORDER BY checked_at DESC LIMIT 500'
    );
    return res.json({ logs: rows });
  } catch (err) {
    console.error('listLogs error:', err);
    return res.status(500).json({ message: 'Server error while fetching logs.' });
  }
}

// ---- PUBLIC: list all dummy products ----
async function listProducts(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY name ASC');
    return res.json({ products: rows });
  } catch (err) {
    console.error('listProducts error:', err);
    return res.status(500).json({ message: 'Server error while fetching products.' });
  }
}

// ---- ADMIN: Create Product ----
async function createProduct(req, res) {
  try {
    const { name, description, price, demoCode } = req.body;
    const imageUrl = req.file?.path;

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' });
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Product image is required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, image_url, demo_code) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', Number(price), imageUrl, demoCode || '']
    );

    const insertId = result.insertId || result.lastInsertRowid;

    // If demo code is set, auto-insert into product_codes if it doesn't already exist
    if (demoCode) {
      const trimmedCode = demoCode.trim().toUpperCase();
      const [existingCodes] = await pool.query('SELECT id FROM product_codes WHERE code = ?', [trimmedCode]);
      if (existingCodes.length === 0) {
        await pool.query(
          'INSERT INTO product_codes (code, batch_name, product_name) VALUES (?, ?, ?)',
          [trimmedCode, 'Demo Product Code', name]
        );
      }
    }

    return res.status(201).json({
      message: 'Product created successfully.',
      product: {
        id: insertId,
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
        demo_code: demoCode || ''
      }
    });
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ message: 'Server error while creating product.' });
  }
}

// ---- ADMIN: Update Product ----
// ---- ADMIN: Update Product ----
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, demoCode } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "Product name and price are required.",
      });
    }

    const [existing] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    // Keep existing image by default
    let imageUrl = existing[0].image_url;

    // If a new image was uploaded to Cloudinary
    if (req.file) {
      imageUrl = req.file.path;
    }

    await pool.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, image_url = ?, demo_code = ?
       WHERE id = ?`,
      [
        name,
        description || "",
        Number(price),
        imageUrl,
        demoCode || "",
        id,
      ]
    );

    // Auto insert demo code if it doesn't exist
    if (demoCode) {
      const trimmedCode = demoCode.trim().toUpperCase();

      const [existingCodes] = await pool.query(
        "SELECT id FROM product_codes WHERE code = ?",
        [trimmedCode]
      );

      if (existingCodes.length === 0) {
        await pool.query(
          `INSERT INTO product_codes
          (code, batch_name, product_name)
          VALUES (?, ?, ?)`,
          [trimmedCode, "Demo Product Code", name]
        );
      }
    }

    return res.json({
      message: "Product updated successfully.",
      product: {
        id: Number(id),
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
        demo_code: demoCode || "",
      },
    });
  } catch (err) {
    console.error("updateProduct error:", err);
    return res.status(500).json({
      message: "Server error while updating product.",
    });
  }
}

// ---- ADMIN: Delete Product ----
// ---- ADMIN: Delete Product ----
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    // Delete product from database
    await pool.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    return res.json({
      message: "Product deleted successfully.",
    });

  } catch (err) {
    console.error("deleteProduct error:", err);

    return res.status(500).json({
      message: "Server error while deleting product.",
    });
  }
}

module.exports = {
  verifyProduct,
  createCodes,
  listCodes,
  listLogs,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

