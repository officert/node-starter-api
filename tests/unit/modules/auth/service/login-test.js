const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let authService;
let authValidator;
let InvalidArgumentError;
let sandbox;

before(() => {
  authService = require('modules/auth');
  authValidator = require('modules/auth/validator');
  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('service', () => {
          describe('login', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called with no options', () => {
              let options = null;

              it('should return an error', () => {
                return authService.login(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when called with options', () => {
              let options = {};

              let validateLoginStub;
              let getOauthDataStub;
              let createOrUpdateUserByEmailStub;
              let issueAuthTokenStub;

              let auth = {
                user: '123'
              };

              let token = 'FOOOOOOOOO';

              before('stub authValidator.validateLogin()', () => {
                validateLoginStub = sandbox.stub(authValidator, 'validateLogin')
                  .returns(Promise.resolve());
              });

              before('stub authService._getOauthData()', () => {
                getOauthDataStub = sandbox.stub(authService, '_getOauthData')
                  .returns(Promise.resolve());
              });

              before('stub authService._createOrUpdateUserByEmail()', () => {
                createOrUpdateUserByEmailStub = sandbox.stub(authService, '_createOrUpdateUserByEmail')
                  .returns(Promise.resolve(auth));
              });

              before('stub authService._issueAuthToken()', () => {
                issueAuthTokenStub = sandbox.stub(authService, '_issueAuthToken')
                  .returns(Promise.resolve({
                    token
                  }));
              });

              it('should return an object containing an auth token', () => {
                return authService.login(options)
                  .then(result => {
                    should.exist(result);
                    result.should.have.ownProperty('token');
                    result.token.should.equal(token);

                    validateLoginStub.callCount.should.equal(1);
                    getOauthDataStub.callCount.should.equal(1);
                    createOrUpdateUserByEmailStub.callCount.should.equal(1);
                    issueAuthTokenStub.callCount.should.equal(1);
                    issueAuthTokenStub.calledWith(auth.user).should.equal(true);
                  });
              });
            });
          });
        });
      });
    });
  });
});
