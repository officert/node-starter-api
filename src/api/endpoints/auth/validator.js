const util = require('util');

const errorMessages = require('modules/auth/constants/errorMessages');
const identityProviders = require('modules/auth/constants/identityProviders');

class AuthValidator {
  login(req) {
    req.checkBody('identityProvider', errorMessages.IDENTITY_PROVIDER_IS_REQUIRED).notEmpty();
    req.checkBody('accessToken', errorMessages.ACCESS_TOKEN_IS_REQUIRED).notEmpty();
    req.checkBody('identityProvider', util.format(errorMessages.IDENTITY_PROVIDER_IS_INVALID, req.body.identityProvider)).inHash(identityProviders);
  }
}

module.exports = new AuthValidator();
