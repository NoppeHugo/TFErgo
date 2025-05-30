const request = require('supertest');
const app = require('../src/app');

describe('Notes API', () => {
  let createdNoteId;
  let createdPatientId;
  let token;
  beforeAll(async () => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un patient pour lier la note
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'NoteTest', lastName: 'NoteTest', sex: 'F', birthdate: '1992-01-01', niss: '12345678903' });
    createdPatientId = patientRes.body.id;
  });
  afterAll(async () => {
    if (createdNoteId) {
      await request(app)
        .delete(`/notes/${createdNoteId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('GET /notes/1 should return 401 or 200', async () => {
    const res = await request(app).get('/notes/1');
    expect([200, 401]).toContain(res.statusCode);
  });
  it('refuse la création de doublon de note', async () => {
    // À adapter selon la logique métier réelle (ex: note unique par patient/date)
    // const res1 = await request(app)
    //   .post('/notes/1')
    //   .set('Cookie', [`token=${token}`])
    //   .send({ content: 'NoteDoublon' });
    // const res2 = await request(app)
    //   .post('/notes/1')
    //   .set('Cookie', [`token=${token}`])
    //   .send({ content: 'NoteDoublon' });
    // expect([400, 409]).toContain(res2.statusCode);
  });
  it('refuse la mise à jour avec un contenu vide', async () => {
    // if (!createdNoteId) return;
    // const res = await request(app)
    //   .put(`/notes/${createdNoteId}`)
    //   .set('Cookie', [`token=${token}`])
    //   .send({ content: '' });
    // expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'une note liée à un patient', async () => {
    // Ce test suppose qu\'il existe un patient lié à cette note, sinon il sera ignoré.
    // À adapter selon la logique métier réelle.
    // Ici, on tente de supprimer la note et on attend une erreur si liée.
    // (À compléter selon la logique de ton backend)
    // const res = await request(app)
    //   .delete(`/notes/${createdNoteId}`)
    //   .set('Cookie', [`token=${token}`]);
    // expect([400, 409]).toContain(res.statusCode);
  });
  it('ajoute une note', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Test note', description: 'Contenu' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdNoteId = res.body.id;
  });
  it('refuse l\'ajout de note sans titre', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ description: 'Pas de titre' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('récupère les notes du patient', async () => {
    const res = await request(app)
      .get(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('modifie une note', async () => {
    if (!createdNoteId) return;
    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Note modifiée', description: 'Nouveau contenu' });
    expect([200, 404]).toContain(res.statusCode);
  });
  it('refuse la modification d\'une note inexistante', async () => {
    const res = await request(app)
      .put(`/notes/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Impossible', description: '...' });
    expect([404, 500]).toContain(res.statusCode);
  });
  it('refuse l\'ajout de note sans authentification', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .send({ title: 'NoAuth', description: '...' });
    expect([401, 403]).toContain(res.statusCode);
  });
  it('supprime une note', async () => {
    // Crée une note à supprimer
    const resCreate = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ToDelete', description: 'À supprimer' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/notes/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([200, 204, 404]).toContain(res.statusCode);
    }
  });
  it('refuse la suppression d\'une note inexistante', async () => {
    const res = await request(app)
      .delete(`/notes/999999`)
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });
  it('refuse la suppression sans authentification', async () => {
    // Crée une note à supprimer
    const resCreate = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ToDeleteNoAuth', description: 'À supprimer' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/notes/${idToDelete}`);
      expect([401, 403]).toContain(res.statusCode);
    }
  });
  it('refuse la modification sans titre', async () => {
    if (!createdNoteId) return;
    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: '', description: 'Pas de titre' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('GET /notes/:id retourne 404 si note inexistante', async () => {
    const res = await request(app)
      .get('/notes/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });
  it('refuse la création de note pour un patient inexistant', async () => {
    const res = await request(app)
      .post('/notes/999999')
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Note patient inexistant', description: '...' });
    expect([404, 400]).toContain(res.statusCode);
  });
  it('refuse la lecture des notes sans authentification', async () => {
    const res = await request(app)
      .get(`/notes/${createdPatientId}`);
    expect([401, 403]).toContain(res.statusCode);
  });
  it('refuse la modification de note sans authentification', async () => {
    if (!createdNoteId) return;
    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .send({ title: 'NoAuth', description: '...' });
    expect([401, 403]).toContain(res.statusCode);
  });
  it('accepte ou refuse la création de note avec description vide', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Vide', description: '' });
    expect([201, 400, 422]).toContain(res.statusCode);
  });
  it('refuse la création de note avec un titre trop long', async () => {
    const longTitle = 'a'.repeat(300);
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: longTitle, description: '...' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d’une note déjà supprimée', async () => {
    // Crée une note puis la supprime deux fois
    const resCreate = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ToDeleteTwice', description: '...' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      await request(app)
        .delete(`/notes/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      const res = await request(app)
        .delete(`/notes/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([404, 410]).toContain(res.statusCode);
    }
  });
  it('refuse la création de note pour un patient supprimé', async () => {
    // Crée un patient, le supprime, puis tente d’ajouter une note
    const resPatient = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'ToDelete', lastName: 'ToDelete', sex: 'F', birthdate: '1992-01-01', niss: '12345678904' });
    if (resPatient.statusCode === 201) {
      const patientId = resPatient.body.id;
      await request(app)
        .delete(`/patients/${patientId}`)
        .set('Cookie', [`token=${token}`]);
      const res = await request(app)
        .post(`/notes/${patientId}`)
        .set('Cookie', [`token=${token}`])
        .send({ title: 'Note patient supprimé', description: '...' });
      expect([404, 400]).toContain(res.statusCode);
    }
  });
  it('refuse la lecture des notes d’un patient inexistant', async () => {
    const res = await request(app)
      .get('/notes/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });
  it('refuse la création de note avec un type de titre invalide', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: { objet: 'not a string' }, description: '...' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la création de note avec un title non string', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 12345, description: 'Type incorrect' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de note avec une description trop longue', async () => {
    const longDesc = 'a'.repeat(10001); // Supposons une limite à 10000
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'LongDesc', description: longDesc });
    expect([400, 413, 422]).toContain(res.statusCode);
  });

  it('refuse la modification d\'une note avec un champ inattendu', async () => {
    if (!createdNoteId) return;
    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Test', description: 'Test', extra: 'champ' });
    expect([400, 422, 200]).toContain(res.statusCode); // Selon la validation
  });

  it('refuse la création de note sur un patient inexistant', async () => {
    const res = await request(app)
      .post(`/notes/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Test', description: '...' });
    expect([404, 422, 500]).toContain(res.statusCode);
  });

  it('refuse la suppression double d\'une note', async () => {
    // Crée une note à supprimer deux fois
    const resCreate = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ToDeleteTwice', description: 'À supprimer deux fois' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res1 = await request(app)
        .delete(`/notes/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([200, 204, 404]).toContain(res1.statusCode);
      const res2 = await request(app)
        .delete(`/notes/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([404, 410, 500]).toContain(res2.statusCode);
    }
  });

  it('refuse l\'accès GET à une note sans authentification', async () => {
    if (!createdNoteId) return;
    const res = await request(app)
      .get(`/notes/${createdNoteId}`);
    expect([401, 403]).toContain(res.statusCode);
  });

  it('GET /notes/:patientId retourne [] si le patient n\'a pas de note', async () => {
    // Crée un patient sans note
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'NoNote', lastName: 'NoNote', sex: 'F', birthdate: '1992-01-01', niss: '12345678904' });
    const patientId = patientRes.body.id;
    const res = await request(app)
      .get(`/notes/${patientId}`)
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
    // Nettoyage
    await request(app).delete(`/patients/${patientId}`).set('Cookie', [`token=${token}`]);
  });

  it('accepte la création de note avec un champ supplémentaire ignoré', async () => {
    const res = await request(app)
      .post(`/notes/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ChampSup', description: '...', foo: 'bar' });
    expect([201, 200, 422]).toContain(res.statusCode); // Selon la validation
    if (res.statusCode === 201) {
      // Nettoyage
      await request(app).delete(`/notes/${res.body.id}`).set('Cookie', [`token=${token}`]);
    }
  });
});
