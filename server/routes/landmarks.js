const router = require('express').Router();
const Landmark = require('../models/Landmark');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/qr/:code', async (req, res) => {
  const l = await Landmark.findOne({ qrCode: req.params.code });
  l ? res.json(l) : res.status(404).json({ message: 'Invalid QR' });
});

router.get('/:id', async (req, res) => {
  try {
    const l = await Landmark.findById(req.params.id);
    l ? res.json(l) : res.status(404).json({ message: 'Not found' });
  } catch { res.status(400).json({ message: 'Bad id' }); }
});

router.post('/:id/visit', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { visited: req.params.id } });
  res.json({ message: 'Unlocked' });
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.qrCode) data.qrCode = 'HR-' + Date.now();
    res.status(201).json(await Landmark.create(data));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) =>
  res.json(await Landmark.findByIdAndUpdate(req.params.id, req.body, { new: true })));

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Landmark.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;