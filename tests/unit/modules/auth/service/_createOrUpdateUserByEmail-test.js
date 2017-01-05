const should = require('should');
const sinon = require('sinon');
const util = require('util');
const Promise = require('bluebird');

let authService;
let authRepository;
let userService;
let authErrorMessages;
let identityProviders;
let InvalidArgumentError;
let sandbox;

before(() => {
  authService = require('modules/auth');
  authRepository = require('modules/auth/data');
  userService = require('modules/user');
  authErrorMessages = require('modules/auth/constants/errorMessages');
  identityProviders = require('modules/auth/constants/identityProviders');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('service', () => {
          describe('_createOrUpdateUserByEmail', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called with no options', () => {
              let options = null;

              it('should return an error', () => {
                return authService._createOrUpdateUserByEmail(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when called with no options.email', () => {
              let options = {
                email: null
              };

              it('should return an error', () => {
                return authService._createOrUpdateUserByEmail(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.email');
                  });
              });
            });

            describe('when called with no options.identityProvider', () => {
              let options = {
                email: 'foo@gmail.com',
                identityProvider: null
              };

              it('should return an error', () => {
                return authService._createOrUpdateUserByEmail(options)
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
                email: 'foo@gmail.com',
                identityProvider: 'FOOBAR'
              };

              it('should return an error', () => {
                return authService._createOrUpdateUserByEmail(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal(util.format(authErrorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider));
                  });
              });
            });

            describe('when user does not exist', () => {
              let options = {
                email: 'foo@gmail.com'
              };

              let newUser = {
                id: '123'
              };

              let findByEmailStub;
              let createUserStub;
              let createAuthStub;

              before('set options.identityProvider', () => {
                options.identityProvider = identityProviders.GITHUB;
              });

              before('stub userService.findByEmail()', () => {
                findByEmailStub = sandbox.stub(userService, 'findByEmail')
                  .returns(Promise.resolve(null));
              });

              before('stub userService.create()', () => {
                createUserStub = sandbox.stub(userService, 'create')
                  .returns(Promise.resolve(newUser));
              });

              before('stub authRepository.create()', () => {
                createAuthStub = sandbox.stub(authRepository, 'create')
                  .returns(Promise.resolve({}));
              });

              it('should call userService.create() and authRepository.create()', () => {
                return authService._createOrUpdateUserByEmail(options)
                  .then(() => {
                    findByEmailStub.callCount.should.equal(1);
                    createUserStub.callCount.should.equal(1);
                    createUserStub.calledWith({
                      email: options.email,
                      firstName: undefined,
                      lastName: undefined,
                      profilePicture: undefined
                    }).should.equal(true);
                    createAuthStub.callCount.should.equal(1);
                    createAuthStub.calledWith({
                      user: newUser.id,
                      identities: [{
                        provider: options.identityProvider
                      }]
                    }).should.equal(true);
                  });
              });
            });

            describe('when user does exist', () => {
              let options = {
                email: 'foo@gmail.com'
              };

              let existingUser = {
                id: '123'
              };

              let findByEmailStub;
              let updateUserStub;
              let addOrUpdateIdentityByUserIdStub;

              before('set options.identityProvider', () => {
                options.identityProvider = identityProviders.GITHUB;
              });

              before('stub userService.findByEmail()', () => {
                findByEmailStub = sandbox.stub(userService, 'findByEmail')
                  .returns(Promise.resolve(existingUser));
              });

              before('stub userService.updateById()', () => {
                updateUserStub = sandbox.stub(userService, 'updateById')
                  .returns(Promise.resolve(existingUser));
              });

              before('stub authService._addOrUpdateIdentityByUserId()', () => {
                addOrUpdateIdentityByUserIdStub = sandbox.stub(authService, '_addOrUpdateIdentityByUserId')
                  .returns(Promise.resolve({}));
              });

              it('should call userService.updateById() and authRepository.create()', () => {
                return authService._createOrUpdateUserByEmail(options)
                  .then(() => {
                    findByEmailStub.callCount.should.equal(1);
                    updateUserStub.callCount.should.equal(1);
                    updateUserStub.calledWith(existingUser.id, {}).should.equal(true);
                    addOrUpdateIdentityByUserIdStub.callCount.should.equal(1);
                    addOrUpdateIdentityByUserIdStub.calledWith(existingUser.id, {
                      identityProvider: options.identityProvider
                    }).should.equal(true);
                  });
              });
            });
          });
        });
      });
    });
  });
});
