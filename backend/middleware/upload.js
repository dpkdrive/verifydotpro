const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Middleware to parse multipart upload and handle multer errors
const uploadSingle = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Image size exceeds the 5MB limit.' });
        }
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Middleware to optimize image if present
const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const uniqueName = `product-${Date.now()}.webp`;
    const outputPath = path.join(uploadsDir, uniqueName);

    // Optimize image: max 800px width/height and convert to webp (quality 80)
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.optimizedFileName = `/uploads/${uniqueName}`;
    next();
  } catch (err) {
    console.error('Image optimization error, falling back to original upload storage:', err);
    try {
      const originalExt = path.extname(req.file.originalname) || '.png';
      const uniqueName = `product-${Date.now()}${originalExt}`;
      const outputPath = path.join(uploadsDir, uniqueName);
      
      fs.writeFileSync(outputPath, req.file.buffer);
      req.optimizedFileName = `/uploads/${uniqueName}`;
      next();
    } catch (fallbackErr) {
      console.error('Fallback save failed:', fallbackErr);
      return res.status(500).json({ message: 'Failed to process and save uploaded image.' });
    }
  }
};

module.exports = {
  uploadSingle,
  optimizeImage
};
