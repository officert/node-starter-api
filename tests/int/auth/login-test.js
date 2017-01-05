const should = require('should');
const util = require('util');
const sinon = require('sinon');

const testUtils = require('tests/utils/testUtils');

require('tests/int/beforeAll');

let agent;
let authErrorMessages;
let authIdentityProviders;
let google;
let github;
let sandbox;

before(() => {
  agent = require('tests/utils/requestAgent').agent;
  authErrorMessages = require('modules/auth/constants/errorMessages');
  authIdentityProviders = require('modules/auth/constants/identityProviders');

  google = require('modules/libs/google');
  github = require('modules/libs/github');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('int', () => {
    describe('auth', () => {
      describe('POST - /auth/login', () => {
        const apiEndpoint = '/auth/login';

        afterEach(() => {
          sandbox.restore();
        });

        describe('when no identityProvider is passed', () => {
          let identityProvider = null;

          it('should return a 400', () => {
            return agent
              .post(apiEndpoint)
              .send({
                identityProvider
              })
              .expect(testUtils.expectError(400, authErrorMessages.IDENTITY_PROVIDER_IS_REQUIRED));
          });
        });

        describe('oauth identity providers', () => {
          describe('when no accessToken is passed', () => {
            let identityProvider;
            let accessToken = null;

            before('set identity provider', () => {
              identityProvider = authIdentityProviders.GITHUB;
            });

            it('should return a 400', () => {
              return agent
                .post(apiEndpoint)
                .send({
                  identityProvider,
                  accessToken
                })
                .expect(testUtils.expectError(400, authErrorMessages.ACCESS_TOKEN_IS_REQUIRED));
            });
          });

          describe('when invalid identityProvider is passed', () => {
            let identityProvider;
            let accessToken = '1234';

            before('set identity provider', () => {
              identityProvider = 'FOOOBAR';
            });

            it('should return a 400', () => {
              return agent
                .post(apiEndpoint)
                .send({
                  identityProvider,
                  accessToken
                })
                .expect(testUtils.expectError(400, util.format(authErrorMessages.IDENTITY_PROVIDER_IS_INVALID, identityProvider)));
            });
          });

          describe('google oauth', () => {
            let identityProvider;
            let accessToken = '1234';

            let getUserInfoStub;

            let googleOAuthData = {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
              profilePicture: 'https://google.com/foobar'
            };

            before('set identity provider', () => {
              identityProvider = authIdentityProviders.GOOGLE;
            });

            before('stub google.getUserInfo()', () => {
              getUserInfoStub = sandbox.stub(google, 'getUserInfo')
                .returns(Promise.resolve(googleOAuthData));
            });

            it('should return a 200 with a token', () => {
              return agent
                .post(apiEndpoint)
                .send({
                  identityProvider,
                  accessToken
                })
                .expect(200)
                .then(response => {
                  should.exist(response);

                  let body = response.body;
                  should.exist(body);
                  body.should.have.ownProperty('token');

                  getUserInfoStub.callCount.should.equal(1);
                });
            });
          });

          describe('github oauth', () => {
            let identityProvider;
            let accessToken = '1234';

            let getUserInfoStub;

            let githubOAuthData = {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
              profilePicture: 'https://github.com/foobar'
            };

            before('set identity provider', () => {
              identityProvider = authIdentityProviders.GITHUB;
            });

            before('stub github.getUserInfo()', () => {
              getUserInfoStub = sandbox.stub(github, 'getUserInfo')
                .returns(Promise.resolve(githubOAuthData));
            });

            it('should return a 200 with a token', () => {
              return agent
                .post(apiEndpoint)
                .send({
                  identityProvider,
                  accessToken
                })
                .expect(200)
                .then(response => {
                  should.exist(response);

                  let body = response.body;
                  should.exist(body);
                  body.should.have.ownProperty('token');

                  getUserInfoStub.callCount.should.equal(1);
                });
            });
          });
        });
      });
    });
  });
});
