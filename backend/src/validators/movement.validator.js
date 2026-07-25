const { body, param } = require('express-validator');

const createMovementValidator = [
  param('id').isMongoId().withMessage('Invalid product id'),
  body('type').isIn(['in', 'out']).withMessage('Type must be "in" or "out"'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('reason').optional().trim(),
];

module.exports = { createMovementValidator };
