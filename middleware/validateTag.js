const { body, validationResult } = require('express-validator');

const validateTag = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tag name is required')
    .isString().withMessage('Tag name must be a string')
    .isLength({ min: 2 }).withMessage('Tag name must be at least 2 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateTag };