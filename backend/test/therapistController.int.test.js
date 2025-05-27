const request = require('supertest');
const app = require('../src/app');

describe('Therapists API', () => {
  it('GET /therapists should return 200 and an array', async () => {
    const res = await request(app).get('/therapists');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
