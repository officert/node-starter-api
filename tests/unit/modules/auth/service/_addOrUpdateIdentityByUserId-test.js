const should = require('should');
const sinon = require('sinon');
const util = require('util');
const Promise = require('bluebird');

let authService;
let authRepository;
let identityProviders;
let authErrorMessages;
let InvalidArgumentError;
let ObjectNotFoundError;
let sandbox;

before(() => {
  authService = require('modules/auth');
  authRepository = require('modules/auth/data');
  authErrorMessages = require('modules/auth/constants/errorMessages');
  identityProviders = require('modules/auth/constants/identityProviders');

  InvalidArgumentError = require('errors/invalidArgumentError');
  ObjectNotFoundError = require('errors/objectNotFoundError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('service', () => {
          describe('_addOrUpdateIdentityByUserId', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called with no options', () => {
              let id = null;

              it('should return an error', () => {
                return authService._addOrUpdateIdentityByUserId(id)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('userId');
                  });
              });
            });

            describe('when called with no options', () => {
              let id = '123';
              let options = null;

              it('should return an error', () => {
                return authService._addOrUpdateIdentityByUserId(id, options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when called with no options.identityProvider', () => {
              let id = '123';
              let options = {
                email: 'foo@gmail.com',
                identityProvider: null
              };

              it('should return an error', () => {
                return authService._addOrUpdateIdentityByUserId(id, options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.identityProvider');
                  });
              });
            });

            describe('when options.identityProvider is invalid', () => {
              let id = '123';
              let options = {
                email: 'foo@gmail.com',
                identityProvider: 'FOOBAR'
              };

              it('should return an error', () => {
                return authService._addOrUpdateIdentityByUserId(id, options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal(util.format(authErrorMessages.IDENTITY_PROVIDER_IS_INVALID, options.identityProvider));
                  });
              });
            });

            describe('when user does not exist', () => {
              let id = '123';
              let options = {
                email: 'foo@gmail.com'
              };

              let findOneStub;

              before('stub identityProvider', () => {
                options.identityProvider = identityProviders.GITHUB;
              });

              before('stub authRepository.findOne()', () => {
                findOneStub = sandbox.stub(authRepository, 'findOne')
                  .returns(Promise.resolve(null));
              });

              it('should return an error', () => {
                return authService._addOrUpdateIdentityByUserId(id, options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(ObjectNotFoundError);
                    err.message.should.equal(authErrorMessages.AUTH_NOT_FOUND);

                    findOneStub.callCount.should.equal(1);
                    findOneStub.calledWith({
                      user: id
                    }).should.equal(true);
                  });
              });
            });

            describe('when user does exist', () => {
              describe('and does not already have an identity for the identityProvider passed', () => {
                let id = '123';
                let options = {
                  email: 'foo@gmail.com'
                };
                let auth = {
                  id: '123',
                  identities: []
                };

                let findOneStub;
                let addIdentityStub;

                before('stub identityProvider', () => {
                  options.identityProvider = identityProviders.GITHUB;
                });

                before('stub authRepository.findOne()', () => {
                  findOneStub = sandbox.stub(authRepository, 'findOne')
                    .returns(Promise.resolve(auth));
                });

                before('stub authRepository.addIdentity()', () => {
                  addIdentityStub = sandbox.stub(authRepository, 'addIdentity')
                    .returns(Promise.resolve());
                });

                it('should resolve and call authService.addIdentity()', () => {
                  return authService._addOrUpdateIdentityByUserId(id, options)
                    .then(() => {
                      findOneStub.callCount.should.equal(1);
                      addIdentityStub.callCount.should.equal(1);
                      addIdentityStub.calledWith(auth.id, options.identityProvider).should.equal(true);
                    });
                });
              });

              describe('and does already have an identity for the identityProvider passed', () => {
                let id = '123';
                let options = {
                  email: 'foo@gmail.com'
                };
                let auth = {
                  id: '123',
                  identities: [{}]
                };

                let findOneStub;
                let updateIdentityByProviderStub;

                before('stub identityProvider', () => {
                  options.identityProvider = identityProviders.GITHUB;

                  auth.identities[0].provider = identityProviders.GITHUB;
                });

                before('stub authRepository.findOne()', () => {
                  findOneStub = sandbox.stub(authRepository, 'findOne')
                    .returns(Promise.resolve(auth));
                });

                before('stub authRepository.updateIdentityByProvider()', () => {
                  updateIdentityByProviderStub = sandbox.stub(authRepository, 'updateIdentityByProvider')
                    .returns(Promise.resolve());
                });

                it('should resolve and call authService.updateIdentityByProvider()', () => {
                  return authService._addOrUpdateIdentityByUserId(id, options)
                    .then(() => {
                      findOneStub.callCount.should.equal(1);
                      updateIdentityByProviderStub.callCount.should.equal(1);
                      updateIdentityByProviderStub.calledWith(auth.id, options.identityProvider).should.equal(true);
                    });
                });
              });
            });
          });
        });
      });
    });
  });
});
