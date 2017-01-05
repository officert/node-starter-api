const InvalidArgumentError = require('errors/invalidArgumentError');
const InternalServerError = require('errors/internalServerError');
const ObjectNotFoundError = require('errors/objectNotFoundError');
const UnauthorizedError = require('errors/unauthorizedError');
const ValidationError = require('errors/validationError');
const ForbiddenError = require('errors/forbiddenError');

const logger = require('modules/logger');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error(err);

  if (err.name === 'ControllerValidatorError') {
    return res.status(400).json({
      errors: err.errors,
      statusCode: 400
    });
  }

  if (err instanceof ObjectNotFoundError) {
    return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
  }

  if (err instanceof InvalidArgumentError) {
    return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
  }

  if (err instanceof UnauthorizedError) {
    return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
  }

  if (err instanceof ForbiddenError) {
    return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
  }

  if (err instanceof InternalServerError) {
    return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
  }

  if (err instanceof ValidationError) {
    return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
  }

  logger.error('ERROR HANDLED:', err);

  return res.status(_getStatusCodeByError(err)).json(_convertErrorIntoMessage(err));
}

function _convertErrorIntoMessage(error) {
  return {
    errors: [
      error.message || 'An error occurred'
    ],
    statusCode: _getStatusCodeByError(error)
  };
}

function _getStatusCodeByError(error) {
  if (error instanceof ValidationError) return 400;
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof ForbiddenError) return 403;
  if (error instanceof ObjectNotFoundError) return 404;
  if (error instanceof InternalServerError) return 500;
  if (error instanceof InvalidArgumentError) return 500;

  return 500;
}

module.exports = errorHandler;
