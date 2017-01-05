const BaseError = require('./baseError');

class InvalidArgumentError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = InvalidArgumentError;
