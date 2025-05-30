const httpMocks = require('node-mocks-http');
const objectiveController = require('../src/controllers/objectiveController');

jest.mock('@prisma/client', () => {
  const mPrisma = {
    interventionReason: { findUnique: jest.fn() },
    longTermObjective: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    shortTermObjective: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('objectiveController (unit)', () => {
  let req, res, prisma;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    prisma = require('@prisma/client').PrismaClient.mock.results[0].value;
    jest.clearAllMocks();
  });

  describe('addLongTermObjective', () => {
    it('should handle server error', async () => {
      req.params.motifId = '1';
      req.body = { title: 'Test', startDate: '2025-01-01' };
      prisma.interventionReason.findUnique.mockRejectedValue(new Error('fail'));
      await objectiveController.addLongTermObjective(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toHaveProperty('error');
    });
    it('should handle motif not found', async () => {
      req.params.motifId = '1';
      req.body = { title: 'Test', startDate: '2025-01-01' };
      prisma.interventionReason.findUnique.mockResolvedValue(null);
      await objectiveController.addLongTermObjective(req, res);
      expect(res.statusCode).toBe(404);
    });
    it('should handle missing title', async () => {
      req.params.motifId = '1';
      req.body = { startDate: '2025-01-01' };
      await objectiveController.addLongTermObjective(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('addShortTermObjective', () => {
    it('should handle server error', async () => {
      req.params.longTermObjectiveId = '1';
      req.body = { title: 'Test', startDate: '2025-01-01', endDate: '2025-02-01' };
      prisma.shortTermObjective.create.mockRejectedValue(new Error('fail'));
      await objectiveController.addShortTermObjective(req, res);
      expect(res.statusCode).toBe(500);
    });
    it('should handle missing title', async () => {
      req.params.longTermObjectiveId = '1';
      req.body = { startDate: '2025-01-01', endDate: '2025-02-01' };
      await objectiveController.addShortTermObjective(req, res);
      expect(res.statusCode).toBe(400);
    });
    it('should handle missing dates', async () => {
      req.params.longTermObjectiveId = '1';
      req.body = { title: 'Test' };
      await objectiveController.addShortTermObjective(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('getMotifWithObjectives', () => {
    it('should handle server error', async () => {
      req.params.id = '1';
      prisma.interventionReason.findUnique.mockRejectedValue(new Error('fail'));
      await objectiveController.getMotifWithObjectives(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('updateLongTermObjective', () => {
    it('should handle server error', async () => {
      req.params.id = '1';
      req.body = { title: 'Test', startDate: '2025-01-01', endDate: '2025-02-01', status: 'ouvert' };
      prisma.longTermObjective.update.mockRejectedValue(new Error('fail'));
      await objectiveController.updateLongTermObjective(req, res);
      expect(res.statusCode).toBe(500);
    });
    it('should handle missing title', async () => {
      req.params.id = '1';
      req.body = { startDate: '2025-01-01', endDate: '2025-02-01', status: 'ouvert' };
      await objectiveController.updateLongTermObjective(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('deleteLongTermObjective', () => {
    it('should handle server error', async () => {
      req.params.id = '1';
      prisma.longTermObjective.delete.mockRejectedValue(new Error('fail'));
      await objectiveController.deleteLongTermObjective(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('deleteShortTermObjective', () => {
    it('should handle server error', async () => {
      req.params.id = '1';
      prisma.shortTermObjective.delete.mockRejectedValue(new Error('fail'));
      await objectiveController.deleteShortTermObjective(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('updateShortTermObjective', () => {
    it('should handle server error', async () => {
      req.params.id = '1';
      req.body = { title: 'Test', startDate: '2025-01-01', endDate: '2025-02-01', status: 'ouvert', description: 'desc' };
      prisma.shortTermObjective.update.mockRejectedValue(new Error('fail'));
      await objectiveController.updateShortTermObjective(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
});
