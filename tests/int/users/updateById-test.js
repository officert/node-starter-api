const should = require('should');
const sinon = require('sinon');

const testUtils = require('tests/utils/testUtils');

require('tests/int/beforeAll');

let agent;
let authService;
let userRepository;
let authRepository;
let authErrorMessages;
let headers;
let dataUtils;
let sandbox;

before(() => {
  agent = require('tests/utils/requestAgent').agent;
  authService = require('modules/auth');
  authErrorMessages = require('modules/auth/constants/errorMessages');
  userRepository = require('modules/user/data');
  authRepository = require('modules/auth/data');
  headers = require('modules/auth/constants/headers');

  dataUtils = require('tests/utils/dataUtils');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('int', () => {
    describe('auth', () => {
      describe('PUT - /users/:id', () => {
        const apiEndpoint = '/users/:id';

        afterEach(() => {
          sandbox.restore();
        });

        describe('when user is not authenticated', () => {
          it('should return a 401', () => {
            return agent
              .put(apiEndpoint.replace(':id', '123'))
              .expect(testUtils.expectError(401, authErrorMessages.NOT_AUTHORIZED));
          });
        });

        describe('when user is authenticated', () => {
          describe('but does not have the same id passed in the url', () => {
            let auth1;
            let user1;
            let auth2;
            let user2;
            let token;

            let updates = {
              firstName: null,
              profilePicture: 'FOOOOO'
            };

            before('create user and auth 1', () => {
              return dataUtils.createUserAndAuth()
                .then(result => {
                  auth1 = result.auth;
                  user1 = result.user;
                });
            });

            before('create user and auth 2', () => {
              return dataUtils.createUserAndAuth()
                .then(result => {
                  auth2 = result.auth;
                  user2 = result.user;
                });
            });

            before('get auth token', () => {
              return authService._issueAuthToken(user2.id)
                .then(result => token = result.token);
            });

            after('delete user 1', () => {
              return userRepository.deleteById(user1.id, {
                soft: false
              });
            });

            after('delete user 2', () => {
              return userRepository.deleteById(user2.id, {
                soft: false
              });
            });

            after('delete auth 1', () => {
              return authRepository.deleteById(auth1.id, {
                soft: false
              });
            });

            after('delete auth 2', () => {
              return authRepository.deleteById(auth2.id, {
                soft: false
              });
            });

            it('should return a 401', () => {
              return agent
                .put(apiEndpoint.replace(':id', user1.id))
                .set(headers.AUTHENTICATION_HEADER, token)
                .send(updates)
                .expect(401);
            });
          });

          describe('and does have the same id passed in the url', () => {
            let auth;
            let user;
            let token;

            let updates = {
              firstName: null,
              profilePicture: 'FOOOOO'
            };

            before('create user and auth', () => {
              return dataUtils.createUserAndAuth()
                .then(result => {
                  auth = result.auth;
                  user = result.user;
                });
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

            it('should return a 200 and the updated user', () => {
              return agent
                .put(apiEndpoint.replace(':id', user.id))
                .set(headers.AUTHENTICATION_HEADER, token)
                .send(updates)
                .expect(200)
                .then(response => {
                  should.exist(response);

                  let currentUser = response.body;
                  should.exist(currentUser);
                  currentUser.id.should.equal(user.id);
                  should.not.exist(currentUser.firstName);
                  currentUser.lastName.should.equal(user.lastName);
                  currentUser.email.should.equal(user.email);
                  currentUser.profilePicture.should.equal(updates.profilePicture);
                });
            });
          });
        });
      });
    });
  });
});
