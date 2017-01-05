const Promise = require('bluebird');
const _ = require('lodash');
const validator = require('validator');

const InvalidArgumentError = require('errors/invalidArgumentError');

class UserValidator {
  validateCreate(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));
    if (!options.email || !_.isString(options.email) || !validator.isEmail(options.email)) return Promise.reject(new InvalidArgumentError('options.email'));
    if (options.firstName && !_.isString(options.firstName)) return Promise.reject(new InvalidArgumentError('options.firstName'));
    if (options.lastName && !_.isString(options.lastName)) return Promise.reject(new InvalidArgumentError('options.lastName'));

    return this._baseValidate(options)
      .then(() => Promise.props({}));
  }

  validateUpdate(options) {
    return this._baseValidate(options)
      .then(() => Promise.props({}));
  }

  _baseValidate(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));

    return Promise.props({});
  }
}

module.exports = new UserValidator();
