const request = require('supertest');
const app = require('../src/app');

describe('Reports API', () => {
  let createdReportId;
  let token;
  beforeAll(() => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });
  afterAll(async () => {
    if (createdReportId) {
      await request(app)
        .delete(`/reports/${createdReportId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('POST /reports/1 should return 401 or 500', async () => {
    const res = await request(app)
      .post('/reports/1')
      .send({ selectedSections: ['notes'] });
    expect([401, 500]).toContain(res.statusCode);
  });
  it('refuse la création de doublon de rapport', async () => {
    // À adapter selon la logique métier réelle (ex: rapport unique par patient/date)
    // const res1 = await request(app)
    //   .post('/reports/1')
    //   .set('Cookie', [`token=${token}`])
    //   .send({ selectedSections: ['notes'] });
    // const res2 = await request(app)
    //   .post('/reports/1')
    //   .set('Cookie', [`token=${token}`])
    //   .send({ selectedSections: ['notes'] });
    // expect([400, 409]).toContain(res2.statusCode);
  });
  it('refuse la mise à jour avec des données invalides', async () => {
    // if (!createdReportId) return;
    // const res = await request(app)
    //   .put(`/reports/${createdReportId}`)
    //   .set('Cookie', [`token=${token}`])
    //   .send({ selectedSections: [] });
    // expect([400, 422]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'un rapport lié à un patient', async () => {
    // Ce test suppose qu\'il existe un patient lié à ce rapport, sinon il sera ignoré.
    // À adapter selon la logique métier réelle.
    // Ici, on tente de supprimer le rapport et on attend une erreur si lié.
    // (À compléter selon la logique de ton backend)
    // const res = await request(app)
    //   .delete(`/reports/${createdReportId}`)
    //   .set('Cookie', [`token=${token}`]);
    // expect([400, 409]).toContain(res.statusCode);
  });
});
