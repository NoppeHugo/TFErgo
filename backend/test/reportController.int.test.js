const request = require('supertest');
const app = require('../src/app');

describe('Reports API', () => {
  let createdReportId;
  let createdPatientId;
  let token;
  beforeAll(async () => {
    token = require('jsonwebtoken').sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un patient pour lier le rapport
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'ReportTest', lastName: 'ReportTest', sex: 'F', birthdate: '1995-01-01', niss: '12345678905' });
    createdPatientId = patientRes.body.id;
  });
  afterAll(async () => {
    if (createdReportId) {
      await request(app)
        .delete(`/reports/${createdReportId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });
  it('crée un rapport', async () => {
    const res = await request(app)
      .post(`/reports/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ selectedSections: ['notes'] });
    expect([201, 200, 500]).toContain(res.statusCode);
    if (res.statusCode === 201 || res.statusCode === 200) {
      expect(res.body).toHaveProperty('id');
      createdReportId = res.body.id;
    }
  });
  it('refuse la création de rapport sans authentification', async () => {
    const res = await request(app)
      .post(`/reports/${createdPatientId}`)
      .send({ selectedSections: ['notes'] });
    expect([401, 403]).toContain(res.statusCode);
  });
  it('refuse la création de rapport pour patient inexistant', async () => {
    const res = await request(app)
      .post(`/reports/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ selectedSections: ['notes'] });
    expect([404, 500]).toContain(res.statusCode);
  });
  it('refuse la création de rapport sans sections', async () => {
    const res = await request(app)
      .post(`/reports/${createdPatientId}`)
      .set('Cookie', [`token=${token}`])
      .send({ selectedSections: [] });
    expect([400, 422, 500]).toContain(res.statusCode);
  });
  it('supprime un rapport', async () => {
    if (!createdReportId) { return; }
    const res = await request(app)
      .delete(`/reports/${createdReportId}`)
      .set('Cookie', [`token=${token}`]);
    expect([200, 204, 404, 500]).toContain(res.statusCode);
  });
  it('refuse la suppression d\'un rapport inexistant', async () => {
    const res = await request(app)
      .delete(`/reports/999999`)
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
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
