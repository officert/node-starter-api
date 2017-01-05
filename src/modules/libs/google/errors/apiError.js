const BaseError = require('errors/baseError');

class GoogleApiError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = GoogleApiError;
