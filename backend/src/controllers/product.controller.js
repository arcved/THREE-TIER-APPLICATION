const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/products?page=&limit=&search=&category=
const listProducts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const { search, category } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) {
    filter.category = category;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  sendSuccess(res, 200, items, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, price, quantity, lowStockThreshold } = req.body;

  const existing = await Product.findOne({ sku: sku.toUpperCase() });
  if (existing) {
    throw new ApiError(409, 'A product with this SKU already exists');
  }

  const product = await Product.create({
    name,
    sku,
    category,
    price,
    quantity,
    lowStockThreshold,
  });

  sendSuccess(res, 201, product);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const updates = (({ name, category, price, lowStockThreshold }) => ({
    name,
    category,
    price,
    lowStockThreshold,
  }))(req.body);

  // Strip undefined keys so we don't overwrite fields the client didn't send
  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, { deleted: true });
});

// GET /api/products/stats
// Aggregation pipeline: totals, inventory value, low-stock count, per-category breakdown,
// top products by value (for bar chart), and the actual low-stock items (for an alert widget)
const getStats = asyncHandler(async (req, res) => {
  const [summary] = await Product.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
              totalUnits: { $sum: '$quantity' },
            },
          },
        ],
        lowStock: [
          { $match: { $expr: { $lte: ['$quantity', '$lowStockThreshold'] } } },
          { $count: 'count' },
        ],
        lowStockItems: [
          { $match: { $expr: { $lte: ['$quantity', '$lowStockThreshold'] } } },
          { $sort: { quantity: 1 } },
          { $limit: 5 },
          { $project: { name: 1, sku: 1, quantity: 1, lowStockThreshold: 1 } },
        ],
        byCategory: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              value: { $sum: { $multiply: ['$price', '$quantity'] } },
            },
          },
          { $sort: { value: -1 } },
        ],
        topProducts: [
          {
            $project: {
              name: 1,
              sku: 1,
              quantity: 1,
              value: { $multiply: ['$price', '$quantity'] },
            },
          },
          { $sort: { value: -1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);

  sendSuccess(res, 200, {
    totalProducts: summary.totals[0]?.totalProducts || 0,
    totalValue: summary.totals[0]?.totalValue || 0,
    totalUnits: summary.totals[0]?.totalUnits || 0,
    lowStockCount: summary.lowStock[0]?.count || 0,
    lowStockItems: summary.lowStockItems,
    byCategory: summary.byCategory,
    topProducts: summary.topProducts,
  });
});

module.exports = {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getStats,
};
