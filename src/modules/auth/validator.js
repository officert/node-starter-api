const Promise = require('bluebird');
const _ = require('lodash');
const util = require('util');

const InvalidArgumentError = require('errors/invalidArgumentError');
const identityProviders = require('./constants/identityProviders');
const errorMessages = require('./constants/errorMessages');

class AuthValidator {
  validateLogin(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));
    if (!options.identityProvider || !_.isString(options.identityProvider)) return Promise.reject(new InvalidArgumentError('options.identityProvider'));
    options.identityProvider = options.identityProvider.toUpperCase();
    if (!identityProviders[options.identityProvider]) return Promise.reject(new InvalidArgumentError(util.format(errorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider)));
    if (!options.accessToken) return Promise.reject(new InvalidArgumentError('accessToken'));

    return Promise.resolve({});
  }
}

module.exports = new AuthValidator();
