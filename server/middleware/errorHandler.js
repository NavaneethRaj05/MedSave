const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  res.status(status).json({ success: false, error: message });
};

module.exports = errorHandler;
