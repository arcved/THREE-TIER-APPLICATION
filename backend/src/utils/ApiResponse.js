function sendSuccess(res, statusCode, data, meta = null) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

module.exports = { sendSuccess };
