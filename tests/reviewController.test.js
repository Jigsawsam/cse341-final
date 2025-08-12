const reviewController = require('../controllers/reviewController');
const { ObjectId } = require('mongodb');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

const { getDatabase } = require('../data/database');

describe('reviewController', () => {
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
    it('returns 200 and list of reviews', async () => {
      const reviews = [{ comment: 'Great' }, { comment: 'Okay' }];
      mockCollection.toArray.mockResolvedValue(reviews);

      await reviewController.getAll(req, res);

      expect(getDatabase().collection).toHaveBeenCalledWith('reviews');
      expect(mockCollection.find).toHaveBeenCalledWith({ userId: req.user.githubId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(reviews);
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.toArray.mockRejectedValue(error);

      await reviewController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch reviews',
        details: error.message
      });
    });
  });

  describe('getSingle', () => {
    it('returns 200 and review when found', async () => {
      const review = { comment: 'Awesome' };
      mockCollection.findOne.mockResolvedValue(review);

      await reviewController.getSingle(req, res);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
        userId: req.user.githubId
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(review);
    });

    it('returns 404 when review not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      await reviewController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Review not found' });
    });

    it('returns 500 on DB error', async () => {
      const error = new Error('DB failure');
      mockCollection.findOne.mockRejectedValue(error);

      await reviewController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch review',
        details: error.message
      });
    });
  });
});
