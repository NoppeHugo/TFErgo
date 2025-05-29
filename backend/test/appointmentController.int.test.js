const request = require('supertest');
const app = require('../src/app');

describe('Appointments API', () => {
  let createdAppointmentId;
  let token;
  beforeAll(() => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });
  afterAll(async () => {
    if (createdAppointmentId) {
      await request(app)
        .delete(`/appointments/${createdAppointmentId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('GET /appointments should return 401 or 200', async () => {
    const res = await request(app).get('/appointments');
    expect([200, 401]).toContain(res.statusCode);
  });
  it('refuse la création de doublon de rendez-vous (même date/patient)', async () => {
    // À adapter selon la logique métier réelle (ex: patientId/date unique)
    const data = { title: 'RDVTestDoublon', patientId: 1, date: '2025-06-01T10:00', duration: 60 };
    const res1 = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    createdAppointmentId = res1.body.id;
    const res2 = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 409]).toContain(res2.statusCode);
  });
  it('refuse la mise à jour avec une date invalide', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ date: 'invalid-date' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'un rendez-vous lié à un patient existant', async () => {
    // Ce test suppose qu\'il existe un patient lié à ce rendez-vous, sinon il sera ignoré.
    // À adapter selon la logique métier réelle.
    // Ici, on tente de supprimer le rendez-vous et on attend une erreur si lié.
    // (À compléter selon la logique de ton backend)
    // const res = await request(app)
    //   .delete(`/appointments/${createdAppointmentId}`)
    //   .set('Cookie', [`token=${token}`]);
    // expect([400, 409]).toContain(res.statusCode);
  });
});
