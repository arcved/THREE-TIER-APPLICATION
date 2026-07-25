const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/products/:id/movements
// Records a stock movement and atomically adjusts Product.quantity.
const createMovement = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { type, quantity, reason } = req.body;

  const delta = type === 'in' ? quantity : -quantity;

  // For "out" movements, only apply the update if there's enough stock —
  // avoids a read-then-write race between checking quantity and updating it.
  const query = { _id: productId };
  if (type === 'out') {
    query.quantity = { $gte: quantity };
  }

  const product = await Product.findOneAndUpdate(
    query,
    { $inc: { quantity: delta } },
    { new: true }
  );

  if (!product) {
    const exists = await Product.findById(productId);
    if (!exists) throw new ApiError(404, 'Product not found');
    throw new ApiError(400, 'Insufficient stock for this movement');
  }

  const movement = await StockMovement.create({
    productId,
    type,
    quantity,
    reason,
    createdBy: req.user.id,
  });

  sendSuccess(res, 201, { movement, product });
});

// GET /api/products/:id/movements
const listMovements = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const movements = await StockMovement.find({ productId })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');

  sendSuccess(res, 200, movements);
});

// GET /api/products/movements/recent
// Latest stock movements across all products — powers the dashboard activity feed
const listRecentMovements = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 50);

  const movements = await StockMovement.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name email')
    .populate('productId', 'name sku');

  sendSuccess(res, 200, movements);
});

module.exports = { createMovement, listMovements, listRecentMovements };
