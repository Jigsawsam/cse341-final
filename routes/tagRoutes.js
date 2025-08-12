const express = require('express');
const router = express.Router();
const { validateTag } = require('../middleware/validateTag');
const { isAdmin } = require('../middleware/isAdmin');
const { getAllTags, getSingleTag, createTag, updateTag, deleteTag } = require('../controllers/tagController');

// Public GET routes
router.get('/', getAllTags);
router.get('/:id', getSingleTag);

// Admin-only POST/PUT/DELETE routes
router.post('/', isAdmin, validateTag, createTag);
router.put('/:id', isAdmin, validateTag, updateTag);
router.delete('/:id', isAdmin, deleteTag);

module.exports = router;

