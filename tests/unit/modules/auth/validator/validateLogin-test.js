const should = require('should');
const sinon = require('sinon');
const util = require('util');

let authValidator;
let InvalidArgumentError;
let identityProviders;
let authErrorMessages;
let sandbox;

before(() => {
  authValidator = require('modules/auth/validator');

  InvalidArgumentError = require('errors/invalidArgumentError');

  identityProviders = require('modules/auth/constants/identityProviders');

  authErrorMessages = require('modules/auth/constants/errorMessages');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('validator', () => {
          describe('validateLogin', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when no options are passed', () => {
              let options = null;

              it('should throw an InvalidArgumentError', () => {
                return authValidator.validateLogin(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when no options.identityProvider is passed', () => {
              let options = {
                identityProvider: null
              };

              it('should throw an InvalidArgumentError', () => {
                return authValidator.validateLogin(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.identityProvider');
                  });
              });
            });

            describe('when no options.identityProvider is not a string', () => {
              let options = {
                identityProvider: 1
              };

              it('should throw an InvalidArgumentError', () => {
                return authValidator.validateLogin(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.identityProvider');
                  });
              });
            });

            describe('when no options.identityProvider is not a valid identity provider', () => {
              let options = {
                identityProvider: 'FOOBAR'
              };

              it('should throw an InvalidArgumentError', () => {
                return authValidator.validateLogin(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal(util.format(authErrorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider));
                  });
              });
            });

            describe('when no options.accessToken is passed', () => {
              let options = {
                accessToken: null
              };

              before('set options.identityProvider', () => {
                options.identityProvider = identityProviders.GITHUB;
              });

              it('should throw an InvalidArgumentError', () => {
                return authValidator.validateLogin(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('accessToken');
                  });
              });
            });

            describe('when are required options are passed', () => {
              let options = {
                accessToken: '123'
              };

              before('set options.identityProvider', () => {
                options.identityProvider = identityProviders.GITHUB;
              });

              it('should return an object', () => {
                return authValidator.validateLogin(options)
                  .then(validationData => {
                    should.exist(validationData);
                  });
              });
            });
          });
        });
      });
    });
  });
});
