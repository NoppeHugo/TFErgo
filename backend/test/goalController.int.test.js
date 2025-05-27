const request = require('supertest');
const app = require('../src/app');

describe('Goals API', () => {
  it('GET /goals should return 200 and an array', async () => {
    const res = await request(app).get('/goals');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
