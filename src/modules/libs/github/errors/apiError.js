const BaseError = require('errors/baseError');

class GithubApiError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = GithubApiError;
