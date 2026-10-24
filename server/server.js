require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/', (req, res) => res.send('Heritage API running'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), require('./routes/auth'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/landmarks', require('./routes/landmarks'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server on ${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1); });