const should = require('should');
const sinon = require('sinon');
const util = require('util');
const Promise = require('bluebird');

let authService;
// let authValidator;
let identityProviders;
let authErrorMessages;
let InvalidArgumentError;
let google;
let github;
let sandbox;

before(() => {
  authService = require('modules/auth');
  // authValidator = require('modules/auth/validator');
  authErrorMessages = require('modules/auth/constants/errorMessages');
  identityProviders = require('modules/auth/constants/identityProviders');

  InvalidArgumentError = require('errors/invalidArgumentError');

  google = require('modules/libs/google');
  github = require('modules/libs/github');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('service', () => {
          describe('_getOauthData', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called with no options', () => {
              let options = null;

              it('should return an error', () => {
                return authService._getOauthData(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when called with no options.identityProvider', () => {
              let options = {
                identityProvider: null
              };

              it('should return an error', () => {
                return authService._getOauthData(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.identityProvider');
                  });
              });
            });

            describe('when options.identityProvider is invalid', () => {
              let options = {
                identityProvider: 'FOOBAR'
              };

              it('should return an error', () => {
                return authService._getOauthData(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal(util.format(authErrorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider));
                  });
              });
            });

            describe('when called with no options.accessToken', () => {
              let options = {
                accessToken: null
              };

              before('set identityProvider', () => {
                options.identityProvider = identityProviders.GOOGLE;
              });

              it('should return an error', () => {
                return authService._getOauthData(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.accessToken');
                  });
              });
            });

            describe('when identityProvider is GOOGLE', () => {
              let options = {
                accessToken: '12345'
              };

              let googleGetUserInfoStub;

              let googleUserInfo = {
                email: 'foo@gmail.com',
                firstName: 'Foo',
                lastName: 'Bar',
                profilePicture: 'https://foobar.jpg'
              };

              before('set identityProvider', () => {
                options.identityProvider = identityProviders.GOOGLE;
              });

              before('stub google.getUserInfo()', () => {
                googleGetUserInfoStub = sandbox.stub(google, 'getUserInfo')
                  .returns(Promise.resolve(googleUserInfo));
              });

              it('should call google.getUserInfo() and return an object of user data', () => {
                return authService._getOauthData(options)
                  .then(oauthInfo => {
                    should.exist(oauthInfo);

                    googleGetUserInfoStub.callCount.should.equal(1);
                    googleGetUserInfoStub.calledWith(options.accessToken).should.equal(true);

                    oauthInfo.email.should.equal(googleUserInfo.email);
                    oauthInfo.firstName.should.equal(googleUserInfo.firstName);
                    oauthInfo.lastName.should.equal(googleUserInfo.lastName);
                    oauthInfo.profilePicture.should.equal(googleUserInfo.profilePicture);
                  });
              });
            });

            describe('when identityProvider is GITHUB', () => {
              let options = {
                accessToken: '12345'
              };

              let githubGetUserInfoStub;

              let githubUserInfo = {
                email: 'foo@gmail.com',
                firstName: 'Foo',
                lastName: 'Bar',
                profilePicture: 'https://foobar.jpg'
              };

              before('set identityProvider', () => {
                options.identityProvider = identityProviders.GITHUB;
              });

              before('stub github.getUserInfo()', () => {
                githubGetUserInfoStub = sandbox.stub(github, 'getUserInfo')
                  .returns(Promise.resolve(githubUserInfo));
              });

              it('should call github.getUserInfo() and return an object of user data', () => {
                return authService._getOauthData(options)
                  .then(oauthInfo => {
                    should.exist(oauthInfo);

                    githubGetUserInfoStub.callCount.should.equal(1);
                    githubGetUserInfoStub.calledWith(options.accessToken).should.equal(true);

                    oauthInfo.email.should.equal(githubUserInfo.email);
                    oauthInfo.firstName.should.equal(githubUserInfo.firstName);
                    oauthInfo.lastName.should.equal(githubUserInfo.lastName);
                    oauthInfo.profilePicture.should.equal(githubUserInfo.profilePicture);
                  });
              });
            });
          });
        });
      });
    });
  });
});
