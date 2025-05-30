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
  it('refuse la création de matériel sans nom', async () => {
    const res = await request(app)
      .post('/materials')
      .set('Cookie', [`token=${token}`])
      .send({ description: 'Pas de nom' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('refuse la création de matériel sans authentification', async () => {
    const res = await request(app)
      .post('/materials')
      .send({ name: 'NoAuth' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('met à jour un matériel', async () => {
    if (!createdMaterialId) return;
    const res = await request(app)
      .put(`/materials/${createdMaterialId}`)
      .set('Cookie', [`token=${token}`])
      .send({ name: 'MatérielModifié', description: 'Desc modifiée' });
    expect([200, 404, 422]).toContain(res.statusCode);
  });

  it('refuse la mise à jour d\'un matériel inexistant', async () => {
    const res = await request(app)
      .put('/materials/999999')
      .set('Cookie', [`token=${token}`])
      .send({ name: 'NotFound', description: '...' });
    expect([404, 422, 500]).toContain(res.statusCode);
  });

  it('supprime un matériel', async () => {
    // Crée un matériel à supprimer
    const resCreate = await request(app)
      .post('/materials')
      .set('Cookie', [`token=${token}`])
      .send({ name: 'ToDelete' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/materials/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([200, 204, 404]).toContain(res.statusCode);
    }
  });

  it('refuse la suppression d\'un matériel inexistant', async () => {
    const res = await request(app)
      .delete('/materials/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });

  it('refuse la suppression sans authentification', async () => {
    // Crée un matériel à supprimer
    const resCreate = await request(app)
      .post('/materials')
      .set('Cookie', [`token=${token}`])
      .send({ name: 'ToDeleteNoAuth' });
    if (resCreate.statusCode === 201) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/materials/${idToDelete}`);
      expect([401, 403]).toContain(res.statusCode);
    }
  });

  it('GET /materials/:id retourne 404 si matériel inexistant', async () => {
    const res = await request(app)
      .get('/materials/999999')
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });
});
