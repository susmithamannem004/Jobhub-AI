import { error as logError } from '../utils/logger.js';
import { config } from '../config/index.js';

export default function errorHandler(err, req, res, _next) {
  const requestId = req.requestId || 'unknown';
  const status = err.status || 500;

  // Log full stack server-side, but avoid exposing secrets in the response.
  logError({ requestId, message: err.message, stack: err.stack });

  res.status(status).json({
    success: false,
    error: {
      requestId,
      message: config.env === 'production' ? (err.exposeMessage || 'Internal Server Error') : err.message,
      code: err.code || 'internal_error'
    }
  });
}
