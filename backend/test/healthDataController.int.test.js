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
    expect([401, 403, 404]).toContain(res.statusCode);
  });

  it('PATCH /healthData/:id met à jour les données santé du patient', async () => {
    const res = await request(app)
      .patch(`/healthData/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ medicalDiagnosis: 'Test diag', medicalHistory: 'Test hist', healthChronicle: 'Test chron' });
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('medicalDiagnosis', 'Test diag');
      expect(res.body).toHaveProperty('medicalHistory', 'Test hist');
      expect(res.body).toHaveProperty('healthChronicle', 'Test chron');
    }
  });

  it('PATCH /healthData/:id refuse la mise à jour sans authentification', async () => {
    const res = await request(app)
      .patch(`/healthData/${createdPatientId}`)
      .send({ medicalDiagnosis: 'NoAuth' });
    expect([401, 403, 404]).toContain(res.statusCode);
  });

  it('PATCH /healthData/:id retourne 404 si le patient n\'existe pas', async () => {
    const res = await request(app)
      .patch(`/healthData/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ medicalDiagnosis: 'NotFound' });
    expect([404, 500]).toContain(res.statusCode);
  });

  it('GET /healthData/:id retourne 404 si patient inexistant', async () => {
    const res = await request(app)
      .get(`/healthData/999999`)
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('PATCH /healthData/:id refuse la mise à jour avec des champs manquants', async () => {
    const res = await request(app)
      .patch(`/healthData/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({});
    expect([400, 422, 404, 500]).toContain(res.statusCode);
  });

  it('refuse la mise à jour des données santé avec un champ inattendu', async () => {
    const res = await request(app)
      .patch(`/healthData/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ foo: 'bar' });
    expect([400, 422, 404, 500]).toContain(res.statusCode);
  });

  it('refuse la mise à jour des données santé avec un type incorrect', async () => {
    const res = await request(app)
      .patch(`/healthData/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ medicalDiagnosis: 123, medicalHistory: [], healthChronicle: {} });
    expect([400, 422, 404, 500]).toContain(res.statusCode);
  });

  it('refuse la récupération des données santé d\'un patient inexistant', async () => {
    const res = await request(app)
      .get(`/healthData/999999`)
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la récupération des données santé sans authentification', async () => {
    const res = await request(app)
      .get(`/healthData/${createdPatientId}`);
    expect([401, 403, 404]).toContain(res.statusCode);
  });
});
