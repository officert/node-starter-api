const GitHubApi = require('github');
const Promise = require('bluebird');

const config = require('config');
const logger = require('modules/logger');

const githubAPi = new GitHubApi({
  debug: true,
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': config.name
  },
  Promise,
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

const GithubApiError = require('./errors/apiError');
const InvalidArgumentError = require('errors/invalidArgumentError');

/**
 * @param {Object}  response
 * @return {Object}
 */
function convertUserInfoResponse(response) {
  if (!response) return null;

  let nameParts = response.name ? response.name.split(' ') : [];

  return {
    firstName: nameParts[0],
    lastName: nameParts.length > 1 ? nameParts[1] : null,
    email: response.email,
    profilePicture: response.avatar_url
  };
}

module.exports = {
  _client: githubAPi, //exposed so we can't mock it during testing

  /**
   * @param {String}  accessToken
   * @return {Promise}
   */
  getUserInfo(accessToken) {
    if (!accessToken) return Promise.reject(new InvalidArgumentError('accessToken'));

    githubAPi.authenticate({
      type: 'oauth',
      token: accessToken
    });

    return Promise.fromCallback((callback) => {
        githubAPi.users.get({}, callback);
      })
      .then(response => convertUserInfoResponse(response))
      .catch(err => {
        logger.error(err);
        throw new GithubApiError('Error authenticating with Github');
      });
  }
};
