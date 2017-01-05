const Promise = require('bluebird');

const BaseRepository = require('modules/base/data');
const AuthModel = require('./model');
const InvalidArgumentError = require('errors/invalidArgumentError');

class AuthRepository extends BaseRepository {
  constructor() {
    super(AuthModel);
  }

  /**
   * @param {String} id
   * @param {String} identityProvider
   */
  addIdentity(id, identityProvider) {
    if (!id) return Promise.reject(new InvalidArgumentError('id'));
    if (!identityProvider) return Promise.reject(new InvalidArgumentError('identityProvider'));

    return AuthModel.findOneAndUpdate({
        _id: id
      }, {
        $push: {
          identities: {
            provider: identityProvider
          }
        }
      }, {
        new: true
      })
      .exec();
  }

  /**
   * @param {String} authId
   * @param {String} identityProvider
   * @param {Object} updates
   */
  updateIdentityByProvider(authId, identityProvider, updates) {
    if (!authId) return Promise.reject(new InvalidArgumentError('authId'));
    if (!identityProvider) return Promise.reject(new InvalidArgumentError('identityProvider'));
    if (!updates) return Promise.reject(new InvalidArgumentError('updates'));

    let $set = {};

    if (updates.lastSignin) {
      $set['identities.$.lastSignin'] = updates.lastSignin;
    }

    return AuthModel.findOneAndUpdate({
        _id: authId,
        'identities.provider': identityProvider
      }, {
        $set
      }, {
        new: true
      })
      .exec();
  }
}

module.exports = new AuthRepository;
