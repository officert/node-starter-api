const Promise = require('bluebird');
const util = require('util');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const config = require('config');
const BaseService = require('modules/base');
const validator = require('./validator');
const ObjectNotFoundError = require('errors/objectNotFoundError');
const InvalidArgumentError = require('errors/invalidArgumentError');
const userService = require('modules/user');
const authRepository = require('./data');
const errorMessages = require('./constants/errorMessages');

const google = require('modules/libs/google');
const github = require('modules/libs/github');

const identityProviders = require('modules/auth/constants/identityProviders');

class AuthService extends BaseService {
  constructor() {
    super(authRepository);
  }

  /**
   * @param {String} token
   */
  isAuthenticated(token) {
    if (!token) return Promise.reject(new InvalidArgumentError('token'));

    return decodeAuthToken(token)
      .then(decoded => findByUserId(decoded.userId));
  }

  /**
   * @param {Object} options
   * @param {String} options.identityProvider
   * @param {String} options.accessToken
   */
  login(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));

    return validator.validateLogin(options)
      .then(() => this._getOauthData({
        identityProvider: options.identityProvider,
        accessToken: options.accessToken
      }))
      .then(oauthData => this._createOrUpdateUserByEmail(oauthData))
      .then(auth => this._issueAuthToken(auth.user));
  }

  /**
   * @param {Object} options
   * @param {String} options.identityProvider
   * @param {String} options.accessToken
   * @return {Promise}
   */
  _getOauthData(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));
    if (!options.identityProvider) return Promise.reject(new InvalidArgumentError('options.identityProvider'));
    if (!identityProviders[options.identityProvider]) return Promise.reject(new InvalidArgumentError(util.format(errorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider)));
    if (!options.accessToken) return Promise.reject(new InvalidArgumentError('options.accessToken'));

    let promise;

    if (options.identityProvider === identityProviders.GOOGLE) {
      promise = google.getUserInfo(options.accessToken);
    } else if (options.identityProvider === identityProviders.GITHUB) {
      promise = github.getUserInfo(options.accessToken);
    }

    return promise
      .then(oauthUserInfo => {
        return {
          email: oauthUserInfo.email,
          firstName: oauthUserInfo.firstName,
          lastName: oauthUserInfo.lastName,
          profilePicture: oauthUserInfo.profilePicture,
          identityProvider: options.identityProvider
        };
      });
  }

  /**
   * @param {Object} options
   * @param {String} options.email
   * @param {String} options.identityProvider
   * @param {String} [options.firstName]
   * @param {String} [options.lastName]
   * @param {String} [options.profilePicture]
   * @return {Promise}
   */
  _createOrUpdateUserByEmail(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));
    if (!options.email) return Promise.reject(new InvalidArgumentError('options.email'));
    if (!options.identityProvider) return Promise.reject(new InvalidArgumentError('options.identityProvider'));
    if (!identityProviders[options.identityProvider]) return Promise.reject(new InvalidArgumentError(util.format(errorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider)));

    return userService.findByEmail(options.email)
      .then(user => {
        if (user) {
          let updates = {};
          if ('firstName' in options) updates.firstName = options.firstName;
          if ('lastName' in options) updates.lastName = options.lastName;
          if ('profilePicture' in options) updates.profilePicture = options.profilePicture;

          return userService.updateById(user.id, updates)
            .then(updatedUser => this._addOrUpdateIdentityByUserId(updatedUser.id, {
              identityProvider: options.identityProvider
            }));
        } else {
          return userService.create({
              email: options.email,
              firstName: options.firstName,
              lastName: options.lastName,
              profilePicture: options.profilePicture
            })
            .then(newUser => this._repository.create({
              user: newUser.id,
              identities: [{
                provider: options.identityProvider
              }]
            }));
        }
      });
  }

  /**
   * @param {String} userId
   * @param {Object} options
   * @param {Object} options.identityProvider
   * @return {Promise}
   */
  _addOrUpdateIdentityByUserId(userId, options) {
    if (!userId) return Promise.reject(new InvalidArgumentError('userId'));
    if (!options) return Promise.reject(new InvalidArgumentError('options'));
    if (!options.identityProvider) return Promise.reject(new InvalidArgumentError('options.identityProvider'));
    if (!identityProviders[options.identityProvider]) return Promise.reject(new InvalidArgumentError(util.format(errorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider)));

    return findByUserId(userId)
      .then(auth => {
        let existingIdentity = _.find(auth.identities, {
          provider: options.identityProvider
        });

        if (existingIdentity) {
          return authRepository.updateIdentityByProvider(auth.id, existingIdentity.provider, {
            lastSignin: new Date()
          });
        } {
          return authRepository.addIdentity(auth.id, options.identityProvider);
        }
      });
  }

  /**
   * @param {String} userId
   * @return {Promise}
   */
  _issueAuthToken(userId) {
    if (!userId) return Promise.reject(new InvalidArgumentError('userId'));

    let token = jwt.sign({
      userId
    }, config.jwt.secret);

    return Promise.resolve({
      token
    });
  }
}

/**
 * @param {Object} auth
 * @return {Promise}
 */
function decodeAuthToken(token) {
  if (!token) return Promise.reject(new InvalidArgumentError('token'));

  return Promise.fromCallback(callback => {
    jwt.verify(token, config.jwt.secret, callback);
  });
}

function findByUserId(userId) {
  if (!userId) return Promise.reject(new InvalidArgumentError('userId'));

  return authRepository.findOne({
      user: userId
    })
    .tap(auth => {
      if (!auth) throw new ObjectNotFoundError(errorMessages.AUTH_NOT_FOUND);
    });
}

module.exports = new AuthService();
