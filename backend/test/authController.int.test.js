const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('POST /auth/login should return 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'badpass' });
    expect(res.statusCode).toBe(401);
  });
});
