const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Contacts API', () => {
  let token;
  let createdPatientId;
  let createdContactId;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un patient pour lier le contact
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'ContactTest', lastName: 'ContactTest', sex: 'M', birthdate: '1990-01-01', niss: '12345678901' });
    createdPatientId = patientRes.body.id;
    // Crée un contact lié à ce patient
    const contactRes = await request(app)
      .post(`/contacts/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'Contact', lastName: 'Test', relation: 'ami', phone: '0600000000', type: 'ami' });
    createdContactId = contactRes.body.id;
  });

  afterAll(async () => {
    if (createdContactId) {
      await request(app)
        .delete(`/contacts/${createdContactId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('GET /contacts/:patientId retourne la liste des contacts du patient', async () => {
    const res = await request(app)
      .get(`/contacts/${createdPatientId}`)
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(c => c.id === createdContactId)).toBeDefined();
  });

  it('refuse la création de contact sans authentification', async () => {
    const res = await request(app)
      .post(`/contacts/${createdPatientId}`)
      .send({ firstName: 'NoAuth', lastName: 'Test', relation: 'ami', phone: '0600000000', type: 'ami' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la création de contact si le champ type est manquant', async () => {
    const res = await request(app)
      .post(`/contacts/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'NoType', lastName: 'Test', relation: 'ami', phone: '0600000000' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/type/);
  });
});
