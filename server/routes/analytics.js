const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Interaction = require('../models/Interaction');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/track', async (req, res) => {
  let user;
  try {
    const h = req.headers.authorization;
    if (h) user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET).id;
  } catch {}
  await Interaction.create({ ...req.body, user });
  res.status(201).json({ ok: true });
});

router.get('/summary', protect, adminOnly, async (req, res) => {
  const [visitorsPerRoute, topLandmarks, arCount, avgSession, users, rating] = await Promise.all([
    Interaction.aggregate([
      { $match: { route: { $ne: null } } },
      { $group: { _id: { route: '$route', s: '$sessionId' } } },
      { $group: { _id: '$_id.route', visitors: { $sum: 1 } } },
      { $lookup: { from: 'routes', localField: '_id', foreignField: '_id', as: 'r' } },
      { $project: { visitors: 1, name: { $arrayElemAt: ['$r.name', 0] } } },
    ]),
    Interaction.aggregate([
      { $group: { _id: '$landmark', views: { $sum: 1 } } },
      { $sort: { views: -1 } }, { $limit: 5 },
      { $lookup: { from: 'landmarks', localField: '_id', foreignField: '_id', as: 'l' } },
      { $project: { views: 1, name: { $arrayElemAt: ['$l.name', 0] } } },
    ]),
    Interaction.countDocuments({ type: { $in: ['ar', 'qr'] } }),
    Interaction.aggregate([{ $match: { duration: { $gt: 0 } } }, { $group: { _id: null, avg: { $avg: '$duration' } } }]),
    User.countDocuments(),
    Rating.aggregate([{ $group: { _id: null, avg: { $avg: '$stars' }, count: { $sum: 1 } } }]),
  ]);
  res.json({
    visitorsPerRoute, topLandmarks, arCount, users,
    avgSession: Math.round(avgSession[0]?.avg || 0),
    avgRating: rating[0] ? +rating[0].avg.toFixed(1) : 0,
    ratingCount: rating[0]?.count || 0,
  });
});

module.exports = router;