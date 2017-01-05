const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let AuthModel;
let authRepository;
let InvalidArgumentError;
let sandbox;

before(() => {
  AuthModel = require('modules/auth/data/model');
  authRepository = require('modules/auth/data');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('repository', () => {
          describe('updateIdentityByProvider', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when authId is not passed', () => {
              let authId = null;

              it('should reject with an error', () => {
                return authRepository.updateIdentityByProvider(authId)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('authId');
                  });
              });
            });

            describe('when identityType is not passed', () => {
              let authId = '123';
              let identityType = null;

              it('should reject with an error', () => {
                return authRepository.updateIdentityByProvider(authId, identityType)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('identityProvider');
                  });
              });
            });

            describe('when updates is not passed', () => {
              let authId = '123';
              let identityProvider = 'FOOBAR';
              let updates = null;

              it('should reject with an error', () => {
                return authRepository.updateIdentityByProvider(authId, identityProvider, updates)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('updates');
                  });
              });
            });

            describe('when all required args are passed', () => {
              let authId = '123';
              let identityProvider = 'FOOBAR';
              let updates = {
                lastSignin: new Date()
              };
              let findOneAndUpdateStub;

              before('stub AuthModel.findOneAndUpdate()', () => {
                findOneAndUpdateStub = sandbox.stub(AuthModel, 'findOneAndUpdate')
                  .returns({
                    exec: () => {
                      return Promise.resolve({});
                    }
                  });
              });

              it('should call AuthModel.findOneAndUpdate()', () => {
                return authRepository.updateIdentityByProvider(authId, identityProvider, updates)
                  .then(() => {
                    findOneAndUpdateStub.callCount.should.equal(1);
                  });
              });
            });
          });
        });
      });
    });
  });
});
