const appointmentController = require('../src/controllers/appointmentController');
const httpMocks = require('node-mocks-http');
const prisma = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mPrisma = {
    appointment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('appointmentController error branches', () => {
  afterEach(() => jest.clearAllMocks());

  it('getAppointments - catch error', async () => {
    const req = { user: { id: 1 } };
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const error = new Error('fail');
    require('@prisma/client').PrismaClient().appointment.findMany.mockRejectedValue(error);
    await appointmentController.getAppointments(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toMatch(/Erreur chargement/);
  });

  it('getAppointmentById - catch error', async () => {
    const req = { params: { id: 1 } };
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const error = new Error('fail');
    require('@prisma/client').PrismaClient().appointment.findUnique.mockRejectedValue(error);
    await appointmentController.getAppointmentById(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toMatch(/Erreur récupération/);
  });

  it('getAppointmentsByPatientId - catch error', async () => {
    const req = { user: { id: 1 }, params: { patientId: 1 } };
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const error = new Error('fail');
    require('@prisma/client').PrismaClient().appointment.findMany.mockRejectedValue(error);
    await appointmentController.getAppointmentsByPatientId(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toMatch(/Erreur récupération des rendez-vous du patient/);
  });
});
