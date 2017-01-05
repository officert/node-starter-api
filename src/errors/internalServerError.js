const BaseError = require('./baseError');

class InternalServerError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = InternalServerError;
