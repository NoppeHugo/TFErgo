const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Motifs API', () => {
  let token;
  let createdPatientId;
  let createdMotifId;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un patient pour lier le motif
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'MotifTest', lastName: 'MotifTest', sex: 'F', birthdate: '1992-01-01', niss: '12345678903' });
    createdPatientId = patientRes.body.id;
    // Crée un motif lié à ce patient
    const motifRes = await request(app)
      .post(`/motifs/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'MotifTest' });
    createdMotifId = motifRes.body.id;
  });

  afterAll(async () => {
    if (createdMotifId) {
      await request(app)
        .delete(`/motifs/${createdMotifId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('GET /motifs/:patientId retourne la liste des motifs du patient', async () => {
    const res = await request(app)
      .get(`/motifs/${createdPatientId}`)
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(m => m.id === createdMotifId)).toBeDefined();
  });

  it('refuse la création de motif sans authentification', async () => {
    const res = await request(app)
      .post(`/motifs/${createdPatientId}`)
      .send({ title: 'NoAuthMotif' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la création de motif si le champ title est manquant', async () => {
    const res = await request(app)
      .post(`/motifs/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({});
    expect([400, 422, 500]).toContain(res.statusCode);
  });
});
