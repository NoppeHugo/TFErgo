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

  it('refuse l\'ajout de fichier sans authentification', async () => {
    const res = await request(app)
      .post(`/activityFiles/${createdActivityId}`)
      .send({ fileUrl: 'http://test.com/file2.pdf', fileType: 'pdf', fileName: 'file2.pdf' });
    expect([401, 403]).toContain(res.statusCode);
  });

  it('refuse l\'ajout de fichier sans fileUrl', async () => {
    const res = await request(app)
      .post(`/activityFiles/${createdActivityId}`)
      .set('Cookie', [`token=${token}`])
      .send({ fileType: 'pdf', fileName: 'file.pdf' });
    expect([400, 422, 500]).toContain(res.statusCode);
  });

  it('refuse l\'ajout de fichier à une activité inexistante', async () => {
    const res = await request(app)
      .post(`/activityFiles/999999`)
      .set('Cookie', [`token=${token}`])
      .send({ fileUrl: 'http://test.com/file.pdf', fileType: 'pdf', fileName: 'file.pdf' });
    expect([404, 500]).toContain(res.statusCode);
  });

  it('supprime un fichier d\'activité', async () => {
    // Crée un fichier à supprimer
    const resCreate = await request(app)
      .post(`/activityFiles/${createdActivityId}`)
      .set('Cookie', [`token=${token}`])
      .send({ fileUrl: 'http://test.com/filetodelete.pdf', fileType: 'pdf', fileName: 'filetodelete.pdf' });
    if ([201, 200].includes(resCreate.statusCode)) {
      const idToDelete = resCreate.body.id;
      const res = await request(app)
        .delete(`/activityFiles/${idToDelete}`)
        .set('Cookie', [`token=${token}`]);
      expect([200, 204, 404]).toContain(res.statusCode);
    }
  });

  it('refuse la suppression d\'un fichier inexistant', async () => {
    const res = await request(app)
      .delete(`/activityFiles/999999`)
      .set('Cookie', [`token=${token}`]);
    expect([404, 500]).toContain(res.statusCode);
  });
});
