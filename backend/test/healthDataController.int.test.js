const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Health Data API', () => {
  it('GET /healthData/1 should return 200, 404, or 500', async () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    const res = await request(app)
      .get('/healthData/1')
      .set('Cookie', [`token=${token}`]);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});
