const { body, validationResult } = require('express-validator');

const reviewValidationRules = [
  body('mediaId').isString().notEmpty().withMessage('mediaId is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer 1-5'),
  body('comment').isString().optional()
];

const validateReview = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { reviewValidationRules, validateReview };