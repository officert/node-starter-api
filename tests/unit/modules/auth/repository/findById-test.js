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
          describe('findById', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when no id is passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return authRepository.findById(id)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('id');
                  });
              });
            });

            describe('when id is passed', () => {
              let id = '123';

              let findByIdStub;

              before('stub AuthModel.findById()', () => {
                findByIdStub = sandbox.stub(AuthModel, 'findById')
                  .returns({
                    exec: () => {
                      return Promise.resolve({});
                    }
                  });
              });

              it('should call AuthModel.findById()', () => {
                return authRepository.findById(id)
                  .then(() => {
                    findByIdStub.callCount.should.equal(1);
                  });
              });
            });
          });
        });
      });
    });
  });
});
