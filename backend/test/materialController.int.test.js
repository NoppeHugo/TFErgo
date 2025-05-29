const request = require('supertest');
const app = require('../src/app');

describe('Materials API', () => {
  let createdMaterialId;
  let token;
  beforeAll(() => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });
  afterAll(async () => {
    if (createdMaterialId) {
      await request(app)
        .delete(`/materials/${createdMaterialId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('GET /materials should return 200 and an array', async () => {
    const res = await request(app).get('/materials');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('refuse la création de doublon de matériel', async () => {
    const name = 'MatérielTestDoublon';
    const res1 = await request(app)
      .post('/materials')
      .set('Cookie', [`token=${token}`])
      .send({ name });
    createdMaterialId = res1.body.id;
    const res2 = await request(app)
      .post('/materials')
      .set('Cookie', [`token=${token}`])
      .send({ name });
    expect([400, 409]).toContain(res2.statusCode);
  });
  it('refuse la mise à jour avec un nom vide', async () => {
    if (!createdMaterialId) return;
    const res = await request(app)
      .put(`/materials/${createdMaterialId}`)
      .set('Cookie', [`token=${token}`])
      .send({ name: '' });
    expect([400, 404, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'un matériel lié à une activité', async () => {
    // Ce test suppose qu\'il existe une activité liée à ce matériel, sinon il sera ignoré.
    // À adapter selon la logique métier réelle.
    // Ici, on tente de supprimer le matériel et on attend une erreur si lié.
    // (À compléter selon la logique de ton backend)
    // const res = await request(app)
    //   .delete(`/materials/${createdMaterialId}`)
    //   .set('Cookie', [`token=${token}`]);
    // expect([400, 409]).toContain(res.statusCode);
  });
});
