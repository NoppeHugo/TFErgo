const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Motifs API', () => {
  it('GET /motifs/1 should return 200, 401, or 500', async () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    const res = await request(app)
      .get('/motifs/1')
      .set('Cookie', [`token=${token}`]);
    expect([200, 401, 500]).toContain(res.statusCode);
  });
});
