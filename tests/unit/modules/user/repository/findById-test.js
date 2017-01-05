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
          describe('findById', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when no id is passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return userRepository.findById(id)
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

              before('stub UserModel.findById()', () => {
                findByIdStub = sandbox.stub(UserModel, 'findById')
                  .returns({
                    exec: () => {
                      return Promise.resolve({});
                    }
                  });
              });

              it('should call UserModel.findById()', () => {
                return userRepository.findById(id)
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
