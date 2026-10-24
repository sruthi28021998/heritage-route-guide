const router = require('express').Router();
const Route = require('../models/Route');
const Landmark = require('../models/Landmark');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => res.json(await Route.find().sort('city')));

router.get('/:id', async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  const landmarks = await Landmark.find({ route: route._id }).sort('order');
  res.json({ route, landmarks });
});

router.post('/', protect, adminOnly, async (req, res) => res.status(201).json(await Route.create(req.body)));

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Landmark.deleteMany({ route: req.params.id });
  await Route.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;