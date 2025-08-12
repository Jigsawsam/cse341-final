const { getDatabase } = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllTags = async (req, res) => {
  //#swagger.tags=['Tags']
  try {
    const tags = await getDatabase().collection('tags').find({}).toArray();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
  }
};

const getSingleTag = async (req, res) => {
  //#swagger.tags=['Tags']
  try {
    const tagId = new ObjectId(req.params.id);
    const tag = await getDatabase().collection('tags').findOne({ _id: tagId });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tag', details: err.message });
  }
};

const createTag = async (req, res) => {
  //#swagger.tags=['Tags']
  try {
    if (!req.body.name || typeof req.body.name !== 'string') {
      return res.status(400).json({ error: 'Tag name is required and must be a string' });
    }

    const newTag = {
      name: req.body.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await getDatabase().collection('tags').insertOne(newTag);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create tag' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create tag', details: err.message });
  }
};

const updateTag = async (req, res) => {
  //#swagger.tags=['Tags']
  try {
    const tagId = new ObjectId(req.params.id);

    if (!req.body.name || typeof req.body.name !== 'string') {
      return res.status(400).json({ error: 'Tag name is required and must be a string' });
    }

    const updatedTag = {
      name: req.body.name.trim(),
      updatedAt: new Date()
    };

    const response = await getDatabase().collection('tags').replaceOne(
      { _id: tagId },
      updatedTag
    );

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to update tag' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tag', details: err.message });
  }
};

const deleteTag = async (req, res) => {
  //#swagger.tags=['Tags']
  try {
    const tagId = new ObjectId(req.params.id);
    const response = await getDatabase().collection('tags').deleteOne({ _id: tagId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to delete tag' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tag', details: err.message });
  }
};

module.exports = { getAllTags, getSingleTag, createTag, updateTag, deleteTag };