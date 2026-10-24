const router = require('express').Router();
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  const { landmark, stars, comment } = req.body;
  if (!landmark || !(stars >= 1 && stars <= 5)) return res.status(400).json({ message: 'Invalid rating' });
  const r = await Rating.findOneAndUpdate(
    { user: req.user._id, landmark },
    { stars, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(r);
});

router.get('/:landmarkId', protect, async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.landmarkId);
  const [agg, mine] = await Promise.all([
    Rating.aggregate([{ $match: { landmark: id } }, { $group: { _id: null, avg: { $avg: '$stars' }, count: { $sum: 1 } } }]),
    Rating.findOne({ landmark: id, user: req.user._id }),
  ]);
  res.json({ avg: agg[0] ? +agg[0].avg.toFixed(1) : 0, count: agg[0]?.count || 0, mine: mine?.stars || 0 });
});

module.exports = router;