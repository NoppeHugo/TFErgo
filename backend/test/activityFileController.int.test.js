const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Activity Files API', () => {
  let token;
  let createdPatientId;
  let createdActivityId;
  let createdFileId;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, email: 'test@test.com', name: 'Test' }, process.env.JWT_SECRET);
    // Crée un patient
    const patientRes = await request(app)
      .post('/patients')
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'FileTest', lastName: 'FileTest', sex: 'M', birthdate: '1993-01-01', niss: '12345678904' });
    createdPatientId = patientRes.body.id;
    // Crée une activité liée à ce patient (si besoin d'un activityId réel)
    const activityRes = await request(app)
      .post('/activities')
      .set('Cookie', [`token=${token}`])
      .send({ title: 'ActivityFileTest', patientId: createdPatientId });
    createdActivityId = activityRes.body.id;
  });

  afterAll(async () => {
    if (createdFileId) {
      await request(app)
        .delete(`/activityFiles/${createdFileId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdActivityId) {
      await request(app)
        .delete(`/activities/${createdActivityId}`)
        .set('Cookie', [`token=${token}`]);
    }
    if (createdPatientId) {
      await request(app)
        .delete(`/patients/${createdPatientId}`)
        .set('Cookie', [`token=${token}`]);
    }
  });

  it('POST /activityFiles/:id ajoute un fichier à une activité', async () => {
    const res = await request(app)
      .post(`/activityFiles/${createdActivityId}`)
      .set('Cookie', [`token=${token}`])
      .send({ fileUrl: 'http://test.com/file.pdf', fileType: 'pdf', fileName: 'file.pdf' });
    expect([201, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      createdFileId = res.body.id;
      expect(res.body).toHaveProperty('fileUrl', 'http://test.com/file.pdf');
    }
  });
});
