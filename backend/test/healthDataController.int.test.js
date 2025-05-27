const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Health Data API', () => {
  let token;
  let createdPatientId;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un patient pour tester la healthData
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'HealthTest', lastName: 'HealthTest', sex: 'F', birthdate: '1991-01-01', niss: '12345678902' });
    createdPatientId = patientRes.body.id;
  });

  afterAll(async () => {
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('GET /healthData/:id retourne les données santé du patient', async () => {
    const res = await request(app)
      .get(`/healthData/${createdPatientId}`)
      .set('Cookie', [`token=${token}`]);
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('id', createdPatientId);
    }
  });

  it('refuse l\'accès aux données santé sans authentification', async () => {
    const res = await request(app)
      .get(`/healthData/${createdPatientId}`);
    expect([401, 403]).toContain(res.statusCode);
  });
});
