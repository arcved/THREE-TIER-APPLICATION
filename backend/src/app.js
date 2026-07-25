const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { corsOrigin, nodeEnv } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

// Liveness/readiness probe — useful once this runs in Kubernetes
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
