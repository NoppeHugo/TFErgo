const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('POST /auth/login should return 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'badpass' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /auth/login should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: '' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('POST /auth/login should return 200 or 401 for valid/invalid credentials', async () => {
    // Remplace par un utilisateur existant dans ta base de test si besoin
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'test' });
    expect([200, 401]).toContain(res.statusCode);
  });

  it('POST /auth/logout should return 200 or 401', async () => {
    const res = await request(app)
      .post('/auth/logout');
    expect([200, 401, 204]).toContain(res.statusCode);
  });
});
