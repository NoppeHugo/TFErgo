const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Patients API', () => {
  let token;
  let createdPatientId;

  beforeAll(() => {
    // Génère un JWT valide pour un thérapeute fictif (id: 1)
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    // Nettoie le patient créé (si existant)
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('crée un patient puis le retrouve dans la liste', async () => {
    // Création d'un patient
    const patientData = {
      firstName: 'JeanTest',
      lastName: 'DupontTest',
      sex: 'M',
      birthdate: '1990-01-01',
      niss: '12345678901',
    };
    const createRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send(patientData);
    expect([200, 201, 500]).toContain(createRes.statusCode);
    expect(createRes.body).toHaveProperty('id');
    createdPatientId = createRes.body.id;

    // Récupération de la liste
    const listRes = await request(app)
      .get('/patients')
      .set('Cookie', [`token=${token}`]);
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    // Vérifie que le patient créé est dans la liste
    const found = listRes.body.find(p => p.id === createdPatientId);
    expect(found).toBeDefined();
    expect(found.firstName).toBe('JeanTest');
    expect(found.lastName).toBe('DupontTest');
  });

  it('refuse la création de patient sans authentification', async () => {
    const patientData = {
      firstName: 'NoAuth',
      lastName: 'Test',
      sex: 'M',
      birthdate: '1990-01-01',
      niss: '12345678999',
    };
    const res = await request(app)
      .post('/patients')
      .send(patientData);
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la création de patient si un champ obligatoire est manquant', async () => {
    const res = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ lastName: 'Test', sex: 'M', birthdate: '1990-01-01' }); // firstName manquant
    expect([400, 422, 500]).toContain(res.statusCode);
  });
});
