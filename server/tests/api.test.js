process.env.JWT_SECRET = 'testsecret';
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Route = require('../models/Route');
const Landmark = require('../models/Landmark');

let mongod, adminToken, userToken, landmark;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  await User.create({ name: 'Admin', email: 'a@test.com', role: 'admin', password: await bcrypt.hash('secret12', 10) });
  adminToken = (await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'secret12' })).body.token;

  const route = await Route.create({ name: 'Test Route', city: 'Delhi' });
  landmark = await Landmark.create({ route: route._id, name: 'Test Fort', qrCode: 'HR-TEST', lat: 28.6, lng: 77.2 });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});

describe('Auth', () => {
  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'U', email: 'u@test.com', password: 'secret12' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'U', email: 'u@test.com', password: 'secret12' });
    expect(res.status).toBe(400);
  });

  it('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'X', email: 'x@test.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'u@test.com', password: 'wrongpass' });
    expect(res.status).toBe(400);
  });
});

describe('Routes and landmarks', () => {
  it('lists routes', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('handles invalid route id without crashing', async () => {
    const res = await request(app).get('/api/routes/not-an-id');
    expect(res.status).toBe(400);
  });

  it('blocks route creation without token', async () => {
    const res = await request(app).post('/api/routes').send({ name: 'R', city: 'C' });
    expect(res.status).toBe(401);
  });

  it('blocks route creation for normal user', async () => {
    const res = await request(app).post('/api/routes').set('Authorization', `Bearer ${userToken}`).send({ name: 'R', city: 'C' });
    expect(res.status).toBe(403);
  });

  it('allows route creation for admin', async () => {
    const res = await request(app).post('/api/routes').set('Authorization', `Bearer ${adminToken}`).send({ name: 'R', city: 'C' });
    expect(res.status).toBe(201);
  });

  it('finds landmark by QR code', async () => {
    const res = await request(app).get('/api/landmarks/qr/HR-TEST');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Fort');
  });

  it('returns 404 for unknown QR code', async () => {
    const res = await request(app).get('/api/landmarks/qr/NOPE');
    expect(res.status).toBe(404);
  });
});

describe('Ratings', () => {
  it('saves and averages a rating', async () => {
    const post = await request(app).post('/api/ratings').set('Authorization', `Bearer ${userToken}`).send({ landmark: landmark._id, stars: 5 });
    expect(post.status).toBe(200);
    const get = await request(app).get(`/api/ratings/${landmark._id}`).set('Authorization', `Bearer ${userToken}`);
    expect(get.body.avg).toBe(5);
    expect(get.body.mine).toBe(5);
  });

  it('rejects invalid stars', async () => {
    const res = await request(app).post('/api/ratings').set('Authorization', `Bearer ${userToken}`).send({ landmark: landmark._id, stars: 9 });
    expect(res.status).toBe(400);
  });
});