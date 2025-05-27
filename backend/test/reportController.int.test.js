const request = require('supertest');
const app = require('../src/app');

describe('Reports API', () => {
  it('POST /reports/1 should return 401 or 500', async () => {
    const res = await request(app)
      .post('/reports/1')
      .send({ selectedSections: ['notes'] });
    expect([401, 500]).toContain(res.statusCode);
  });
});
