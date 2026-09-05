export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found: ${req.originalUrl}`))
}

export function errorHandler(error, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = error.message || 'Internal server error'

  if (error.name === 'CastError') {
    statusCode = 404
    message = 'Resource not found'
  }
  if (error.code === 11000) {
    statusCode = 409
    message = `${Object.keys(error.keyValue).join(', ')} already exists`
  }
  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(error.errors).map((item) => item.message).join(', ')
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}
