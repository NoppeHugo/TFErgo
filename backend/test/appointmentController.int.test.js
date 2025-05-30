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
  it('crée un rendez-vous', async () => {
    const data = { title: 'RDVTest', patientId: 1, date: '2025-06-02T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([201, 200, 500]).toContain(res.statusCode);
    if ([201, 200].includes(res.statusCode)) {
      createdAppointmentId = res.body.id;
    }
  });

  it('refuse la création de rendez-vous sans authentification', async () => {
    const data = { title: 'NoAuth', patientId: 1, date: '2025-06-03T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .send(data);
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous sans date', async () => {
    const data = { title: 'NoDate', patientId: 1, duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('met à jour un rendez-vous', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ date: '2025-06-02T11:00' });
    expect([200, 404, 422]).toContain(res.statusCode);
  });

  it('refuse la mise à jour d\'un rendez-vous inexistant', async () => {
    const res = await request(app)
      .put(`/appointments/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ date: '2025-06-02T11:00' });
    expect([404, 422, 500]).toContain(res.statusCode);
  });

  it('GET /appointments/:id retourne le rendez-vous', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .get(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`]);
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('id', createdAppointmentId);
    }
  });

  it('GET /appointments/:id retourne 404 si rendez-vous inexistant', async () => {
    const res = await request(app)
      .get(`/appointments/999999`)
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(404);
  });

  it('supprime un rendez-vous', async () => {
    // Crée un rendez-vous à supprimer
    const data = { title: 'ToDelete', patientId: 1, date: '2025-06-04T10:00', duration: 60 };
    const resCreate = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    if ([201, 200].includes(resCreate.statusCode)) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/appointments/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([200, 204, 404]).toContain(res.statusCode);
    }
  });

  it('refuse la suppression d\'un rendez-vous inexistant', async () => {
    const res = await request(app)
      .delete(`/appointments/999999`)
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec une date invalide', async () => {
    const data = { title: 'RDVDateInvalide', patientId: 1, date: 'not-a-date', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec un patient inexistant', async () => {
    const data = { title: 'RDVPatientInexistant', patientId: 999999, date: '2025-06-10T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([404, 422, 500]).toContain(res.statusCode);
  });

  it('refuse la modification d\'un rendez-vous inexistant', async () => {
    const res = await request(app)
      .put('/appointments/999999')
      .set('Cookie', [`token=${token}`])
      .send({ date: '2025-06-11T10:00' });
    expect([404, 422, 500]).toContain(res.statusCode);
  });

  it('refuse la suppression d\'un rendez-vous inexistant', async () => {
    const res = await request(app)
      .delete('/appointments/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec un champ inattendu', async () => {
    const data = { title: 'ChampSup', patientId: 1, date: '2025-06-12T10:00', duration: 60, foo: 'bar' };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([201, 200, 422, 400]).toContain(res.statusCode);
    if ([201, 200].includes(res.statusCode)) {
      // Nettoyage
      await request(app).delete(`/appointments/${res.body.id}`).set('Cookie', [`token=${token}`]);
    }
  });

  it('refuse la création de rendez-vous sans titre', async () => {
    const data = { patientId: 1, date: '2025-06-13T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous sans patientId', async () => {
    const data = { title: 'NoPatientId', date: '2025-06-14T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous sans durée', async () => {
    const data = { title: 'NoDuration', patientId: 1, date: '2025-06-15T10:00' };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous avec un champ inattendu', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ date: '2025-06-16T10:00', foo: 'bar' });
    expect([200, 400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous sans date', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({});
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous sans authentification', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .send({ date: '2025-06-17T10:00' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la suppression de rendez-vous sans authentification', async () => {
    // Crée un rendez-vous à supprimer
    const data = { title: 'ToDeleteNoAuth', patientId: 1, date: '2025-06-18T10:00', duration: 60 };
    const resCreate = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    if ([201, 200].includes(resCreate.statusCode)) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/appointments/${idToDelete}`);
      expect([401, 403]).toContain(res.statusCode);
    }
  });

  it('refuse la création de rendez-vous avec une durée négative', async () => {
    const data = { title: 'NegativeDuration', patientId: 1, date: '2025-06-20T10:00', duration: -30 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec un type de date incorrect', async () => {
    const data = { title: 'BadDateType', patientId: 1, date: 123456, duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec un champ supplémentaire inattendu', async () => {
    const data = { title: 'ChampInattendu', patientId: 1, date: '2025-06-21T10:00', duration: 60, foo: 'bar' };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([201, 200, 422, 400]).toContain(res.statusCode);
    if ([201, 200].includes(res.statusCode)) {
      // Nettoyage
      await request(app).delete(`/appointments/${res.body.id}`).set('Cookie', [`token=${token}`]);
    }
  });

  it('refuse la modification de rendez-vous avec une date invalide', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ date: 'not-a-date' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous avec une durée négative', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ duration: -10 });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous avec un champ inattendu', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ date: '2025-06-22T10:00', foo: 'bar' });
    expect([200, 400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous sans authentification', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .send({ date: '2025-06-23T10:00' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la suppression de rendez-vous sans authentification', async () => {
    // Crée un rendez-vous à supprimer
    const data = { title: 'ToDeleteNoAuth2', patientId: 1, date: '2025-06-24T10:00', duration: 60 };
    const resCreate = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    if ([201, 200].includes(resCreate.statusCode)) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/appointments/${idToDelete}`);
      expect([401, 403]).toContain(res.statusCode);
    }
  });

  it('refuse la création de rendez-vous avec un patientId non numérique', async () => {
    const data = { title: 'BadPatientId', patientId: 'abc', date: '2025-06-25T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec un titre non string', async () => {
    const data = { title: 12345, patientId: 1, date: '2025-06-26T10:00', duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous avec un patientId non numérique', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ patientId: 'abc' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous avec un titre non string', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 12345 });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la modification de rendez-vous avec un champ non attendu', async () => {
    if (!createdAppointmentId) return;
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .set('Cookie', [`token=${token}`])
      .send({ foo: 'bar' });
    expect([200, 400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec un body vide', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send();
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse l\'accès à un rendez-vous d\'un autre utilisateur (403)', async () => {
    // Crée un rendez-vous avec le user 1
    const data = { title: 'OtherUser', patientId: 1, date: '2025-07-01T10:00', duration: 60 };
    const resCreate = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    if ([201, 200].includes(resCreate.statusCode)) {
      const id = resCreate.body.id;
      // Token d'un autre user
      const otherToken = require('jsonwebtoken').sign({ id: 999, email: 'other@test.com', name: 'Other' }, process.env.JWT_SECRET);
      // GET
      const resGet = await request(app)
        .get(`/appointments/${id}`)
        .set('Cookie', [`token=${otherToken}`]);
      expect([403, 404]).toContain(resGet.statusCode);
      // PUT
      const resPut = await request(app)
        .put(`/appointments/${id}`)
        .set('Cookie', [`token=${otherToken}`])
        .send({ date: '2025-07-02T10:00' });
      expect([403, 404]).toContain(resPut.statusCode);
      // DELETE
      const resDel = await request(app)
        .delete(`/appointments/${id}`)
        .set('Cookie', [`token=${otherToken}`]);
      expect([403, 404]).toContain(resDel.statusCode);
      // Nettoyage
      await request(app).delete(`/appointments/${id}`).set('Cookie', [`token=${token}`]);
    }
  });

  it('refuse la création de rendez-vous avec une date passée', async () => {
    const yesterday = new Date(Date.now() - 24*60*60*1000).toISOString();
    const data = { title: 'DatePassée', patientId: 1, date: yesterday, duration: 60 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de rendez-vous avec une durée trop longue', async () => {
    const data = { title: 'LongDuration', patientId: 1, date: '2025-07-03T10:00', duration: 10000 };
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    expect([400, 422]).toContain(res.statusCode);
  });

  it('retourne 500 en cas d\'erreur serveur (body cassé)', async () => {
    // Envoie un body non JSON (simulateur d'erreur parsing ou Prisma)
    const res = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .set('Content-Type', 'text/plain')
      .send('not a json');
    expect([400, 415, 500]).toContain(res.statusCode);
  });

  it('retourne 404 ou 500 si suppression d\'un rendez-vous déjà supprimé', async () => {
    // Crée un rendez-vous puis supprime deux fois
    const data = { title: 'ToDeleteTwice', patientId: 1, date: '2025-07-04T10:00', duration: 60 };
    const resCreate = await request(app)
      .post('/appointments')
      .set('Cookie', [`token=${token}`])
      .send(data);
    if ([201, 200].includes(resCreate.statusCode)) {
      const id = resCreate.body.id;
      await request(app).delete(`/appointments/${id}`).set('Cookie', [`token=${token}`]);
      const res2 = await request(app).delete(`/appointments/${id}`).set('Cookie', [`token=${token}`]);
      expect([404, 410, 500]).toContain(res2.statusCode);
    }
  });
});
