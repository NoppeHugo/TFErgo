const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Activities API', () => {
  let token;
  let createdActivityId;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée une activité pour le test
    const activityRes = await request(app)
      .post('/activities')
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ActivityTest', therapistId: 1, name: 'ActivityTest' });
    createdActivityId = activityRes.body.id;
  });

  afterAll(async () => {
    if (createdActivityId) {
      await request(app)
        .delete(`/activities/${createdActivityId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('GET /activities should return 200 and an array', async () => {
    const res = await request(app)
      .get('/activities')
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(a => a.id === createdActivityId)).toBeDefined();
  });

  it('refuse la création d\'activité sans authentification', async () => {
    const res = await request(app)
      .post('/activities')
      .send({ title: 'NoAuth', therapistId: 1, name: 'NoAuth' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la création d\'activité si therapistId ou name est manquant', async () => {
    const res = await request(app)
      .post('/activities')
      .set('Cookie', [`token=${token}`])
      .send({ title: 'NoTherapistId' });
    expect([400, 422]).toContain(res.statusCode);
  });
});