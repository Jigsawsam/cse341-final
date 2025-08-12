const mediaController = require('../controllers/mediaController');
const { ObjectId } = require('mongodb');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

const { getDatabase } = require('../data/database');

describe('mediaController', () => {
  let req, res, mockCollection;

  beforeEach(() => {
    req = {
      user: { githubId: 'user123' },
      params: { id: new ObjectId().toHexString() }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
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

  describe('getAll', () => {
    it('returns 200 and list of media', async () => {
      const mediaList = [{ title: 'A' }, { title: 'B' }];
      mockCollection.toArray.mockResolvedValue(mediaList);

      await mediaController.getAll(req, res);

      expect(getDatabase().collection).toHaveBeenCalledWith('media');
      expect(mockCollection.find).toHaveBeenCalledWith({ userId: req.user.githubId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mediaList);
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.toArray.mockRejectedValue(error);

      await mediaController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch media',
        details: error.message
      });
    });
  });

  describe('getSingle', () => {
    it('returns 200 and media when found', async () => {
      const media = { title: 'My Media' };
      mockCollection.findOne.mockResolvedValue(media);

      await mediaController.getSingle(req, res);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
        userId: req.user.githubId
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(media);
    });

    it('returns 404 when media not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      await mediaController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Media not found' });
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.findOne.mockRejectedValue(error);

      await mediaController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch media',
        details: error.message
      });
    });
  });
});
