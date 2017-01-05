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
          describe('updateById', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when id is not passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return authRepository.updateById(id)
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
              let data = null;

              it('should reject with an error', () => {
                return authRepository.updateById(id, data)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('data');
                  });
              });
            });

            describe('when id and data are passed', () => {
              let id = '123';
              let data = {};
              let findOneAndUpdateStub;

              before('stub AuthModel.findOneAndUpdateStub()', () => {
                findOneAndUpdateStub = sandbox.stub(AuthModel, 'findOneAndUpdate')
                  .returns(Promise.resolve([{}]));
              });

              it('should call AuthModel.findOneAndUpdateStub()', () => {
                return authRepository.updateById(id, data)
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
