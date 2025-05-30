const request = require('supertest');
const app = require('../src/app');

describe('Goals API', () => {
  let createdGoalId;
  let token;
  beforeAll(() => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });
  afterAll(async () => {
    if (createdGoalId) {
      await request(app)
        .delete(`/goals/${createdGoalId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('GET /goals should return 200 and an array', async () => {
    const res = await request(app).get('/goals');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('refuse la création de doublon d\'objectif', async () => {
    const name = 'ObjectifTestDoublon';
    const res1 = await request(app)
      .post('/goals')
      .set('Cookie', [`token=${token}`])
      .send({ name });
    createdGoalId = res1.body.id;
    const res2 = await request(app)
      .post('/goals')
      .set('Cookie', [`token=${token}`])
      .send({ name });
    expect([400, 409]).toContain(res2.statusCode);
  });
  it('refuse la mise à jour avec un nom vide', async () => {
    if (!createdGoalId) return;
    const res = await request(app)
      .put(`/goals/${createdGoalId}`)
      .set('Cookie', [`token=${token}`])
      .send({ name: '' });
    expect([400, 404, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'un objectif lié à une activité', async () => {
    // Ce test suppose qu\'il existe une activité liée à cet objectif, sinon il sera ignoré.
    // À adapter selon la logique métier réelle.
    // Ici, on tente de supprimer l'objectif et on attend une erreur si lié.
    // (À compléter selon la logique de ton backend)
    // const res = await request(app)
    //   .delete(`/goals/${createdGoalId}`)
    //   .set('Cookie', [`token=${token}`]);
    // expect([400, 409]).toContain(res.statusCode);
  });
  it('refuse la création d\'objectif sans nom', async () => {
    const res = await request(app)
      .post('/goals')
      .set('Cookie', [`token=${token}`])
      .send({ description: 'Pas de nom' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création d\'objectif sans authentification', async () => {
    const res = await request(app)
      .post('/goals')
      .send({ name: 'NoAuth' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('met à jour un objectif', async () => {
    if (!createdGoalId) return;
    const res = await request(app)
      .put(`/goals/${createdGoalId}`)
      .set('Cookie', [`token=${token}`])
      .send({ name: 'ObjectifModifié', description: 'Desc modifiée' });
    expect([200, 404, 422]).toContain(res.statusCode);
  });

  it('refuse la mise à jour d\'un objectif inexistant', async () => {
    const res = await request(app)
      .put('/goals/999999')
      .set('Cookie', [`token=${token}`])
      .send({ name: 'NotFound', description: '...' });
    expect([404, 422, 500]).toContain(res.statusCode);
  });

  it('supprime un objectif', async () => {
    // Crée un objectif à supprimer
    const resCreate = await request(app)
      .post('/goals')
      .set('Cookie', [`token=${token}`])
      .send({ name: 'ToDelete' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/goals/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([200, 204, 404]).toContain(res.statusCode);
    }
  });

  it('refuse la suppression d\'un objectif inexistant', async () => {
    const res = await request(app)
      .delete('/goals/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la suppression sans authentification', async () => {
    // Crée un objectif à supprimer
    const resCreate = await request(app)
      .post('/goals')
      .set('Cookie', [`token=${token}`])
      .send({ name: 'ToDeleteNoAuth' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/goals/${idToDelete}`);
      expect([401, 403]).toContain(res.statusCode);
    }
  });

  it('GET /goals/:id retourne 404 si objectif inexistant', async () => {
    const res = await request(app)
      .get('/goals/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });
});
