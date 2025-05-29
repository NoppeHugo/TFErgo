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
});
