const request = require('supertest');
const app = require('../src/app');

describe('Activities API', () => {
  it('GET /activities should return 200 and an array', async () => {
    const res = await request(app).get('/activities');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});