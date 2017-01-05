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
          describe('create', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when data is not passed', () => {
              let data = null;

              it('should reject with an error', () => {
                return authRepository.create(data)
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

              before('stub AuthModel.create()', () => {
                createStub = sandbox.stub(AuthModel, 'create')
                  .returns(Promise.resolve([{}]));
              });

              it('should call AuthModel.create()', () => {
                return authRepository.create(data)
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
