const tagController = require('../controllers/tagController');
const { ObjectId } = require('mongodb');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

const { getDatabase } = require('../data/database');

describe('tagController', () => {
  let req, res, mockCollection;

  beforeEach(() => {
    req = { params: { id: new ObjectId().toHexString() } };
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

  describe('getAllTags', () => {
    it('returns 200 and list of tags', async () => {
      const tags = [{ name: 'tag1' }, { name: 'tag2' }];
      mockCollection.toArray.mockResolvedValue(tags);

      await tagController.getAllTags(req, res);

      expect(getDatabase().collection).toHaveBeenCalledWith('tags');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tags);
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.toArray.mockRejectedValue(error);

      await tagController.getAllTags(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch tags',
        details: error.message
      });
    });
  });

  describe('getSingleTag', () => {
    it('returns 200 and tag when found', async () => {
      const tag = { name: 'tagName' };
      mockCollection.findOne.mockResolvedValue(tag);

      await tagController.getSingleTag(req, res);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id)
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tag);
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.findOne.mockRejectedValue(error);

      await tagController.getSingleTag(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch tag',
        details: error.message
      });
    });
  });
});
