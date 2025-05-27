const request = require('supertest');
const app = require('../src/app');

describe('Appointments API', () => {
  it('GET /appointments should return 401 or 200', async () => {
    const res = await request(app).get('/appointments');
    expect([200, 401]).toContain(res.statusCode);
  });
});
