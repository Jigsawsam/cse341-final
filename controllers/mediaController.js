const { getDatabase } = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //#swagger.tags=['Media']
  try {
    const userId = req.session.user.id;
    const media = await getDatabase().collection('media')
      .find({ userId })
      .toArray();

    res.status(200).json(media);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media', details: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Media']
  try {
    const userId = req.session.user.id;
    const mediaId = new ObjectId(req.params.id);

    const media = await getDatabase().collection('media').findOne({ _id: mediaId, userId });

    if (!media) return res.status(404).json({ error: 'Media not found' });

    res.status(200).json(media);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media', details: err.message });
  }
};

const createMedia = async (req, res) => {
  //#swagger.tags=['Media']
  try {
    const userId = req.session.user.id;
    const newMedia = {
      //userId,
      title: req.body.title,
      type: req.body.type,
      genre: req.body.genre || '',
      notes: req.body.notes || '',
      updatedAt: new Date()
    };

    const response = await getDatabase().collection('media').insertOne(newMedia);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create media' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create media', details: err.message });
  }
};

const updateMedia = async (req, res) => {
  //#swagger.tags=['Media']
  try {
    const userId = req.session.user.id;
    const mediaId = new ObjectId(req.params.id);

    const updatedMedia = {
      //userId,
      title: req.body.title,
      type: req.body.type,
      genre: req.body.genre || '',
      notes: req.body.notes || '',
      updatedAt: new Date()
    };

    const response = await getDatabase().collection('media').replaceOne(
      { _id: mediaId, userId },
      updatedMedia
    );

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Media not found or no changes' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update media', details: err.message });
  }
};

const deleteMedia = async (req, res) => {
  //#swagger.tags=['Media']
  try {
    const userId = req.session.user.id;
    const mediaId = new ObjectId(req.params.id);

    const response = await getDatabase().collection('media').deleteOne({ _id: mediaId, userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media', details: err.message });
  }
};

module.exports = { getAll, getSingle, createMedia, updateMedia, deleteMedia };
