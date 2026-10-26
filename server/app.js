require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.set('trust proxy', 1);
app.use(helmet());

const origins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : true;
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.send('Heritage API running'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), require('./routes/auth'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/landmarks', require('./routes/landmarks'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/upload', require('./routes/upload'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;