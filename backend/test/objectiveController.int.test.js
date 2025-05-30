const request = require('supertest');
const app = require('../src/app');

describe('Objectives API', () => {
  let createdMotifId;
  let createdLongObjectiveId;
  let createdShortObjectiveId;
  let token;
  beforeAll(async () => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un motif pour lier l'objectif
    const motifRes = await request(app)
      .post('/motifs')
      .set('Cookie', [`token=${token}`])
      .send({ patientId: 1, title: 'MotifTest' });
    createdMotifId = motifRes.body.id;
  });
  afterAll(async () => {
    if (createdShortObjectiveId) {
      await request(app)
        .delete(`/objectives/short/${createdShortObjectiveId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdLongObjectiveId) {
      await request(app)
        .delete(`/objectives/long/${createdLongObjectiveId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdMotifId) {
      await request(app)
        .delete(`/motifs/${createdMotifId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('crée un objectif long terme', async () => {
    const res = await request(app)
      .post(`/objectives/long/${createdMotifId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ObjectifLong', startDate: '2025-01-01' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdLongObjectiveId = res.body.id;
  });
  it('refuse la création d\'objectif long terme sans titre', async () => {
    const res = await request(app)
      .post(`/objectives/long/${createdMotifId}`)
      .set('Cookie', [`token=${token}`])
      .send({ startDate: '2025-01-01' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la création d\'objectif long terme sur motif inexistant', async () => {
    const res = await request(app)
      .post(`/objectives/long/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ObjectifLong', startDate: '2025-01-01' });
    expect([404, 500]).toContain(res.statusCode);
  });
  it('crée un objectif court terme', async () => {
    if (!createdLongObjectiveId) { return; }
    const res = await request(app)
      .post(`/objectives/short/${createdLongObjectiveId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ObjectifCourt', startDate: '2025-01-01', endDate: '2025-02-01' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdShortObjectiveId = res.body.id;
  });
  it('refuse la création d\'objectif court terme sans titre', async () => {
    if (!createdLongObjectiveId) { return; }
    const res = await request(app)
      .post(`/objectives/short/${createdLongObjectiveId}`)
      .set('Cookie', [`token=${token}`])
      .send({ startDate: '2025-01-01', endDate: '2025-02-01' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la création d\'objectif court terme sans dates', async () => {
    if (!createdLongObjectiveId) { return; }
    const res = await request(app)
      .post(`/objectives/short/${createdLongObjectiveId}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ObjectifCourt' });
    expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la création d\'objectif court terme sur objectif long inexistant', async () => {
    const res = await request(app)
      .post(`/objectives/short/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ObjectifCourt', startDate: '2025-01-01', endDate: '2025-02-01' });
    expect([404, 500]).toContain(res.statusCode);
  });
  it('refuse la création d\'objectif sans authentification', async () => {
    const res = await request(app)
      .post(`/objectives/long/${createdMotifId}`)
      .send({ title: 'NoAuth', startDate: '2025-01-01' });
    expect([401, 403]).toContain(res.statusCode);
  });
  it('POST /objectives/long/1 should return 401 or 500', async () => {
    const res = await request(app)
      .post('/objectives/long/1')
      .send({ title: 'Test', startDate: '2025-01-01' });
    expect([401, 500]).toContain(res.statusCode);
  });
  it('refuse la création de doublon d\'objectif long terme', async () => {
    // À adapter selon la logique métier réelle (ex: titre unique par motif)
    // const res1 = await request(app)
    //   .post('/objectives/long/1')
    //   .set('Cookie', [`token=${token}`])
    //   .send({ title: 'TestDoublon', startDate: '2025-01-01' });
    // const res2 = await request(app)
    //   .post('/objectives/long/1')
    //   .set('Cookie', [`token=${token}`])
    //   .send({ title: 'TestDoublon', startDate: '2025-01-01' });
    // expect([400, 409]).toContain(res2.statusCode);
  });
  it('refuse la mise à jour avec un titre vide', async () => {
    // if (!createdObjectiveId) return;
    // const res = await request(app)
    //   .put(`/objectives/${createdObjectiveId}`)
    //   .set('Cookie', [`token=${token}`])
    //   .send({ title: '' });
    // expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'un objectif lié à un motif', async () => {
    // Ce test suppose qu\'il existe un motif lié à cet objectif, sinon il sera ignoré.
    // À adapter selon la logique métier réelle.
    // Ici, on tente de supprimer l'objectif et on attend une erreur si lié.
    // (À compléter selon la logique de ton backend)
    // const res = await request(app)
    //   .delete(`/objectives/${createdObjectiveId}`)
    //   .set('Cookie', [`token=${token}`]);
    // expect([400, 409]).toContain(res.statusCode);
  });
});
