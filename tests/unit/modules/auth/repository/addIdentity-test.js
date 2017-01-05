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
          describe('addIdentity', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when id is not passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return authRepository.addIdentity(id)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('id');
                  });
              });
            });

            describe('when data is not passed', () => {
              let id = '123';
              let identityProvider = null;

              it('should reject with an error', () => {
                return authRepository.addIdentity(id, identityProvider)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('identityProvider');
                  });
              });
            });

            describe('when id and identityProvider are passed', () => {
              let id = '123';
              let identityProvider = 'FOOBAR';
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
                return authRepository.addIdentity(id, identityProvider)
                  .then(() => {
                    findOneAndUpdateStub.callCount.should.equal(1);
                    findOneAndUpdateStub.calledWith({
                      _id: id
                    }, {
                      $push: {
                        identities: {
                          provider: identityProvider
                        }
                      }
                    }, {
                      new: true
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
