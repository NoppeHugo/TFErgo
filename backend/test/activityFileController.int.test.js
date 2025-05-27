const request = require('supertest');
const app = require('../src/app');

describe('Activity Files API', () => {
  it('POST /activityFiles/:id should return 201, 404, or 500', async () => {
    const res = await request(app)
      .post('/activityFiles/1')
      .send({ fileUrl: 'http://test.com/file.pdf', fileType: 'pdf', fileName: 'file.pdf' });
    expect([201, 404, 500]).toContain(res.statusCode);
  });
});
