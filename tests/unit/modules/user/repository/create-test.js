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
          describe('create', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when data is not passed', () => {
              let data = null;

              it('should reject with an error', () => {
                return userRepository.create(data)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('data');
                  });
              });
            });

            describe('when data is passed', () => {
              let data = {};
              let createStub;

              before('stub UserModel.create()', () => {
                createStub = sandbox.stub(UserModel, 'create')
                  .returns(Promise.resolve([{}]));
              });

              it('should call UserModel.create()', () => {
                return userRepository.create(data)
                  .then(() => {
                    createStub.callCount.should.equal(1);
                  });
              });
            });
          });
        });
      });
    });
  });
});
