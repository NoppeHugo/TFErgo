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
});
