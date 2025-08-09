const { getDatabase } = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //#swagger.tags=['Reviews']
  try {
    const userId = req.session.user.id;

    const reviews = await getDatabase().collection('reviews')
      .find({ userId })
      .toArray();

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Reviews']
  try {
    const userId = req.session.user.id;
    const reviewId = new ObjectId(req.params.id);

    const review = await getDatabase().collection('reviews').findOne({ _id: reviewId, userId });

    if (!review) return res.status(404).json({ error: 'Review not found' });

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review', details: err.message });
  }
};

const createReview = async (req, res) => {
  //#swagger.tags=['Reviews']
  try {
    const userId = req.session.user.id;
    const newReview = {
      userId,
      mediaId: req.body.mediaId,
      rating: req.body.rating,
      comment: req.body.comment || '',
      updatedAt: new Date()
    };

    const response = await getDatabase().collection('reviews').insertOne(newReview);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create review' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review', details: err.message });
  }
};

const updateReview = async (req, res) => {
  //#swagger.tags=['Reviews']
  try {
    const userId = req.session.user.id;
    const reviewId = new ObjectId(req.params.id);

    const updatedReview = {
      userId,
      mediaId: req.body.mediaId,
      rating: req.body.rating,
      comment: req.body.comment || ''
    };

    const response = await getDatabase().collection('reviews').replaceOne(
      { _id: reviewId, userId },
      updatedReview
    );

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Review not found or no changes' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review', details: err.message });
  }
};

const deleteReview = async (req, res) => {
  //#swagger.tags=['Reviews']
  try {
    const userId = req.session.user.id;
    const reviewId = new ObjectId(req.params.id);

    const response = await getDatabase().collection('reviews').deleteOne({ _id: reviewId, userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
};

module.exports = { getAll, getSingle, createReview, updateReview, deleteReview };
