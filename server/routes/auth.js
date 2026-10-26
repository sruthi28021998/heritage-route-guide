const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, language: u.language, favorites: u.favorites, visited: u.visited });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, language } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already used' });
    const user = await User.create({ name, email, language, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user._id), user: out(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: out(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', protect, (req, res) => res.json(out(req.user)));

router.put('/language', protect, async (req, res) => {
  req.user.language = req.body.language;
  await req.user.save();
  res.json(out(req.user));
});

router.post('/favorites/:id', protect, async (req, res) => {
  const i = req.user.favorites.findIndex((f) => f.toString() === req.params.id);
  if (i > -1) req.user.favorites.splice(i, 1); else req.user.favorites.push(req.params.id);
  await req.user.save();
  res.json(out(req.user));
});
router.get('/journey', protect, async (req, res) => {
  const u = await User.findById(req.user._id).populate('visited favorites', 'name route images');
  res.json({ visited: u.visited, favorites: u.favorites });
});
module.exports = router;