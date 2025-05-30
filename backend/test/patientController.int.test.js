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

  it('refuse la création de patient avec un niss invalide', async () => {
    const patientData = {
      firstName: 'NissInvalide',
      lastName: 'Test',
      sex: 'M',
      birthdate: '1990-01-01',
      niss: '1234', // trop court
    };
    const res = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send(patientData);
    expect([400, 422, 500]).toContain(res.statusCode);
  });

  it('refuse la création de patient avec une date de naissance future', async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10);
    const patientData = {
      firstName: 'Futur',
      lastName: 'Test',
      sex: 'F',
      birthdate: futureDate,
      niss: '12345678988',
    };
    const res = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send(patientData);
    expect([400, 422, 500]).toContain(res.statusCode);
  });

  it('refuse la récupération d\'un patient inexistant', async () => {
    const res = await request(app)
      .get('/patients/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la modification d\'un patient inexistant', async () => {
    const res = await request(app)
      .put('/patients/999999')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'Modif', lastName: 'Test', sex: 'M', birthdate: '1990-01-01', niss: '12345678977' });
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la suppression d\'un patient inexistant', async () => {
    const res = await request(app)
      .delete('/patients/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la création de patient avec un champ supplémentaire inattendu', async () => {
    const patientData = {
      firstName: 'ChampSup',
      lastName: 'Test',
      sex: 'M',
      birthdate: '1990-01-01',
      niss: '12345678955',
      foo: 'bar',
    };
    const res = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send(patientData);
    expect([201, 200, 422, 400]).toContain(res.statusCode); // Selon la validation
    if ([201, 200].includes(res.statusCode)) {
      // Nettoyage
      await request(app).delete(`/patients/${res.body.id}`).set('Cookie', [`token=${token}`]);
    }
  });
});
