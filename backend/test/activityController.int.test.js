const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

// Génère un nom unique pour chaque test pour éviter les doublons
function uniqueName(base) {
  return `${base}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

describe('Activities API', () => {
  let token;
  let createdActivityId;
  let activityName;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
  });

  beforeEach(async () => {
    // Nettoie les activités de test précédentes (optionnel, à adapter selon la volumétrie)
    await request(app)
      .delete('/activities/cleanup-test') // À implémenter côté backend si besoin, sinon ignorer cette ligne
      .set('Cookie', [`token=${token}`]);
    // Crée une activité unique pour le test
    activityName = uniqueName('ActivityTest');
    const activityRes = await request(app)
      .post('/activities')
      .set('Cookie', [`token=${token}`])
      .send({ title: activityName, therapistId: 1, name: activityName });
    expect([200, 201]).toContain(activityRes.statusCode);
    expect(activityRes.body).toHaveProperty('id');
    createdActivityId = activityRes.body.id;
  });

  afterEach(async () => {
    if (createdActivityId) {
      await request(app)
        .delete(`/activities/${createdActivityId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('refuse la création d\'activité sans authentification', async () => {
    const res = await request(app)
      .post('/activities')
      .send({ title: 'NoAuth', therapistId: 1, name: 'NoAuth' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse la création d\'activité si therapistId ou name est manquant', async () => {
    const res = await request(app)
      .post('/activities')
      .set('Cookie', [`token=${token}`])
      .send({ title: 'NoTherapistId' });
    expect([400, 422]).toContain(res.statusCode);
  });

  it('GET /activities should return 200 and an array', async () => {
    const res = await request(app)
      .get('/activities')
      .set('Cookie', [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Vérifie que l'activité créée est bien présente
    expect(res.body.find(a => a.id === createdActivityId)).toBeDefined();
    expect(res.body.find(a => a.name === activityName)).toBeDefined();
  });
});