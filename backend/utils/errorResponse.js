/**
 * Custom error class to handle API errors
 * @extends Error
 */
class ErrorResponse extends Error {
  /**
   * Create a new ErrorResponse
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a bad request error (400)
   * @param {string} message - Error message
   * @returns {ErrorResponse} Bad request error
   */
  static badRequest(message) {
    return new ErrorResponse(message, 400);
  }

  /**
   * Create an unauthorized error (401)
   * @param {string} message - Error message
   * @returns {ErrorResponse} Unauthorized error
   */
  static unauthorized(message = 'Not authorized to access this route') {
    return new ErrorResponse(message, 401);
  }

  /**
   * Create a forbidden error (403)
   * @param {string} message - Error message
   * @returns {ErrorResponse} Forbidden error
   */
  static forbidden(message = 'Forbidden') {
    return new ErrorResponse(message, 403);
  }

  /**
   * Create a not found error (404)
   * @param {string} resource - Name of the resource not found
   * @returns {ErrorResponse} Not found error
   */
  static notFound(resource = 'Resource') {
    return new ErrorResponse(`${resource} not found`, 404);
  }

  /**
   * Create a validation error (422)
   * @param {string|Array} errors - Validation errors
   * @returns {ErrorResponse} Validation error
   */
  static validationError(errors) {
    const message = Array.isArray(errors) 
      ? errors.map(err => err.msg || err.message || err).join('. ') 
      : errors;
    return new ErrorResponse(message, 422);
  }

  /**
   * Create a conflict error (409)
   * @param {string} message - Error message
   * @returns {ErrorResponse} Conflict error
   */
  static conflict(message = 'Resource already exists') {
    return new ErrorResponse(message, 409);
  }

  /**
   * Create a too many requests error (429)
   * @param {string} message - Error message
   * @returns {ErrorResponse} Too many requests error
   */
  static tooManyRequests(message = 'Too many requests, please try again later') {
    return new ErrorResponse(message, 429);
  }

  /**
   * Create a server error (500)
   * @param {string} message - Error message
   * @returns {ErrorResponse} Server error
   */
  static serverError(message = 'Internal Server Error') {
    return new ErrorResponse(message, 500);
  }
}

module.exports = ErrorResponse;
