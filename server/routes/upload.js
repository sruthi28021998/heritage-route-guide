const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/', protect, adminOnly, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: 'auto', folder: 'heritage' },
    (err, result) => (err ? res.status(500).json({ message: err.message }) : res.json({ url: result.secure_url }))
  );
  stream.end(req.file.buffer);
});

module.exports = router;