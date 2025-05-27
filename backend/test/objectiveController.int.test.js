const request = require('supertest');
const app = require('../src/app');

describe('Objectives API', () => {
  it('POST /objectives/long/1 should return 401 or 500', async () => {
    const res = await request(app)
      .post('/objectives/long/1')
      .send({ title: 'Test', startDate: '2025-01-01' });
    expect([401, 500]).toContain(res.statusCode);
  });
});
