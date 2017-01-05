const BaseError = require('./baseError');

class ForbiddenError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = ForbiddenError;
