const { body, validationResult } = require('express-validator');

const mediaValidationRules = [
  body('title').isString().notEmpty().withMessage('Title is required and must be a string'),
  body('type').isString().notEmpty().withMessage('Type is required and must be a string'),
  body('genre').isString().optional(),
  body('notes').isString().optional()
];

const validateMedia = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { mediaValidationRules, validateMedia };
