const should = require('should');
const sinon = require('sinon');

const testUtils = require('tests/utils/testUtils');

require('tests/int/beforeAll');

let agent;
let authService;
let userService;
let authRepository;
let userRepository;
let authErrorMessages;
let authIdentityProviders;
let headers;
let sandbox;

before(() => {
  agent = require('tests/utils/requestAgent').agent;
  authService = require('modules/auth');
  userService = require('modules/user');
  authRepository = require('modules/auth/data');
  userRepository = require('modules/user/data');
  authErrorMessages = require('modules/auth/constants/errorMessages');
  authIdentityProviders = require('modules/auth/constants/identityProviders');
  headers = require('modules/auth/constants/headers');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('int', () => {
    describe('auth', () => {
      describe('GET - /users/me', () => {
        const apiEndpoint = '/users/me';

        afterEach(() => {
          sandbox.restore();
        });

        describe('when user is not authenticated', () => {
          it('should return a 401', () => {
            return agent
              .get(apiEndpoint)
              .expect(testUtils.expectError(401, authErrorMessages.NOT_AUTHORIZED));
          });
        });

        describe('when user is authenticated', () => {
          let email = 'foobar@foobar.com';
          let firstName = 'John';
          let lastName = 'Doe';
          let profilePicture = 'https://foobar.com/john.jpg';

          let auth;
          let user;
          let token;

          before('create user and auth', () => {
            return authService._createOrUpdateUserByEmail({
                email,
                firstName,
                lastName,
                profilePicture,
                identityProvider: authIdentityProviders.GITHUB
              })
              .then(result => {
                auth = result;
                return userService.findById(auth.user);
              })
              .then(result => user = result);
          });

          before('get auth token', () => {
            return authService._issueAuthToken(user.id)
              .then(result => token = result.token);
          });

          after('delete user', () => {
            return userRepository.deleteById(user.id, {
              soft: false
            });
          });

          after('delete auth', () => {
            return authRepository.deleteById(auth.id, {
              soft: false
            });
          });

          it('should return a 200 and the current authenticated user', () => {
            return agent
              .get(apiEndpoint)
              .set(headers.AUTHENTICATION_HEADER, token)
              .expect(200)
              .then(response => {
                should.exist(response);

                let currentUser = response.body;
                should.exist(currentUser);
                currentUser.id.should.equal(user.id);
                currentUser.firstName.should.equal(user.firstName);
                currentUser.lastName.should.equal(user.lastName);
                currentUser.email.should.equal(user.email);
                currentUser.profilePicture.should.equal(user.profilePicture);
              });
          });
        });
      });
    });
  });
});
