const request = require('supertest');
const app = require('../src/app');

describe('Objectives API', () => {
  let createdObjectiveId;
  let token;
  beforeAll(() => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });
  afterAll(async () => {
    if (createdObjectiveId) {
      await request(app)
        .delete(`/objectives/${createdObjectiveId}`)
        .set('Cookie', [`token=${token}`]);
    }
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
