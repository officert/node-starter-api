const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let UserModel;
let userRepository;
let InvalidArgumentError;
let sandbox;

before(() => {
  UserModel = require('modules/user/data/model');
  userRepository = require('modules/user/data');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
        describe('repository', () => {
          describe('updateById', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when id is not passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return userRepository.updateById(id)
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
                return userRepository.updateById(id, data)
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

              before('stub UserModel.findOneAndUpdateStub()', () => {
                findOneAndUpdateStub = sandbox.stub(UserModel, 'findOneAndUpdate')
                  .returns(Promise.resolve([{}]));
              });

              it('should call UserModel.findOneAndUpdateStub()', () => {
                return userRepository.updateById(id, data)
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
