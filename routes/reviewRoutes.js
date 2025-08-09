const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const isAuthenticated = require('../middleware/authenticate');
const { reviewValidationRules, validateReview } = require('../middleware/validateReview');

router.get('/', isAuthenticated, reviewController.getAll);
router.get('/:id', isAuthenticated, reviewController.getSingle);
router.post('/', isAuthenticated, reviewValidationRules, validateReview, reviewController.createReview);
router.put('/:id', isAuthenticated, reviewValidationRules, validateReview, reviewController.updateReview);
router.delete('/:id', isAuthenticated, reviewController.deleteReview);

module.exports = router;
