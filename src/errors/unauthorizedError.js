const BaseError = require('./baseError');

class UnauthorizedError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = UnauthorizedError;
