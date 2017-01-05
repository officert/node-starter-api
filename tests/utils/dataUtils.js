const userService = require('modules/user');
const authService = require('modules/auth');
const authIdentityProviders = require('modules/auth/constants/identityProviders');
const utils = require('src/utils/utils');

module.exports = {
  /**
   * @return {Object}
   */
  createUserAndAuth(options = {}) {
    options.email = options.email || `johndoe@test-${utils.generateGuid()}.com`;
    options.firstName = options.firstName || 'John';
    options.lastName = options.lastName || 'Doe';
    options.profilePicture = options.profilePicture || 'https://foobar.com/johndoe.jpg';
    options.identityProvider = options.identityProvider || authIdentityProviders.GITHUB;

    let auth;
    return authService._createOrUpdateUserByEmail(options)
      .then(result => {
        auth = result;
        return userService.findById(auth.user);
      })
      .then(user => {
        return {
          auth,
          user
        };
      });
  }
};
