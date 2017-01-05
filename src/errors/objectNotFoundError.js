const BaseError = require('./baseError');

class ObjectNotFoundError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = ObjectNotFoundError;
