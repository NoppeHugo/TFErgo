const request = require('supertest');
const app = require('../src/app');

describe('Materials API', () => {
  it('GET /materials should return 200 and an array', async () => {
    const res = await request(app).get('/materials');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
