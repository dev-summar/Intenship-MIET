const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(pdf|doc|docx)$/i.test(file.originalname);
    if (allowed) cb(null, true);
    else cb(new Error('Only PDF and Word documents are allowed'));
  },
});

const router = express.Router();

router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return sendError(res, 'File too large', 400);
      }
      return sendError(res, err.message || 'Upload failed', 400);
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded', 400);
  }
  const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  return sendSuccess(res, 'File uploaded', { url });
});

module.exports = router;
