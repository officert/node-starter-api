const BaseError = require('errors/baseError');

class PostmarkApiError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = PostmarkApiError;
