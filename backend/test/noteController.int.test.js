const request = require('supertest');
const app = require('../src/app');

describe('Notes API', () => {
  it('GET /notes/1 should return 401 or 200', async () => {
    const res = await request(app).get('/notes/1');
    expect([200, 401]).toContain(res.statusCode);
  });
});
