const BaseError = require('./baseError');

class ValidationError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = ValidationError;
