const adminController = require('../controllers/adminController');
const { ObjectId } = require('mongodb');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

const { getDatabase } = require('../data/database');

describe('adminController', () => {
  let req, res, mockCollection;

  beforeEach(() => {
    req = { params: { id: new ObjectId().toHexString() } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      findOne: jest.fn()
    };

    getDatabase.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection)
    });
  });

  describe('getAllAdmins', () => {
    it('returns 200 and list of admins on success', async () => {
      const admins = [{ githubId: 'a1' }, { githubId: 'a2' }];
      mockCollection.toArray.mockResolvedValue(admins);

      await adminController.getAllAdmins(req, res);

      expect(getDatabase().collection).toHaveBeenCalledWith('users');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(admins);
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.toArray.mockRejectedValue(error);

      await adminController.getAllAdmins(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch admins',
        details: error.message
      });
    });
  });

  describe('getAdminById', () => {
    it('returns 200 and admin if found', async () => {
      const admin = { githubId: 'admin123', role: 'admin' };
      mockCollection.findOne.mockResolvedValue(admin);

      await adminController.getAdminById(req, res);

      expect(getDatabase().collection).toHaveBeenCalledWith('users');
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
        role: 'admin'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(admin);
    });

    it('returns 404 if admin not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      await adminController.getAdminById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Admin not found' });
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.findOne.mockRejectedValue(error);

      await adminController.getAdminById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch admin',
        details: error.message
      });
    });
  });
});
