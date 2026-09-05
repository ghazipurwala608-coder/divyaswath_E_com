export function sendSuccess(res, { statusCode = 200, message = 'Request completed successfully', data = null, meta } = {}) {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    ...(meta ? { meta } : {}),
  })
}

