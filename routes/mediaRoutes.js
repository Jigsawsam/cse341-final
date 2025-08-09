const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const isAuthenticated = require('../middleware/authenticate');
const { mediaValidationRules, validateMedia } = require('../middleware/validateMedia');

router.get('/', isAuthenticated, mediaController.getAll);
router.get('/:id', isAuthenticated, mediaController.getSingle);
router.post('/', isAuthenticated, mediaValidationRules, validateMedia, mediaController.createMedia);
router.put('/:id', isAuthenticated, mediaValidationRules, validateMedia, mediaController.updateMedia);
router.delete('/:id', isAuthenticated, mediaController.deleteMedia);

module.exports = router;