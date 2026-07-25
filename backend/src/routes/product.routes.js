const express = require('express');
const {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getStats,
} = require('../controllers/product.controller');
const {
  createMovement,
  listMovements,
  listRecentMovements,
} = require('../controllers/movement.controller');
const {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
  listProductsValidator,
} = require('../validators/product.validator');
const { createMovementValidator } = require('../validators/movement.validator');
const validate = require('../middleware/validate.middleware');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', listProductsValidator, validate, listProducts);
router.post('/', createProductValidator, validate, createProduct);
router.get('/stats', getStats);
router.get('/movements/recent', listRecentMovements);
router.get('/:id', idParamValidator, validate, getProduct);
router.patch('/:id', updateProductValidator, validate, updateProduct);
router.delete('/:id', idParamValidator, validate, deleteProduct);

router.post('/:id/movements', createMovementValidator, validate, createMovement);
router.get('/:id/movements', idParamValidator, validate, listMovements);

module.exports = router;
