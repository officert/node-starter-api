const googleApis = require('googleapis');
const Promise = require('bluebird');

const GoogleApiError = require('./errors/apiError');
const InvalidArgumentError = require('errors/invalidArgumentError');

/**
 * @param {Object}  response
 * @return {Object}
 */
function convertUserInfoResponse(response) {
  if (!response) return null;

  return {
    firstName: response.name ? response.name.givenName : null,
    lastName: response.name ? response.name.familyName : null,
    email: response.emails && response.emails.length ? response.emails[0].value : null,
    profilePicture: response.image ? response.image.url : null
  };
}

module.exports = {
  /**
   * @param {String}  accessToken
   * @return {Promise}
   */
  getUserInfo(accessToken) {
    if (!accessToken) return Promise.reject(new InvalidArgumentError('accessToken'));

    return Promise.fromCallback((callback) => {
      googleApis
        .plus('v1')
        .people
        .get({
          access_token: accessToken,
          userId: 'me'
        }, (err, response) => {
          if (err) {
            return callback(new GoogleApiError(err.message));
          }
          return callback(null, convertUserInfoResponse(response));
        });
    });
  }
};
