// backend/middleware/errorHandler.js

// Runs when no route matched the requested URL
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Central error handler - must have exactly 4 arguments
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // Log the full error on the server for debugging
  console.error("❌ Error:", err.message);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

module.exports = { notFound, errorHandler };