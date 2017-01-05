const sinon = require('sinon');
const Promise = require('bluebird');

let UserModel;
let authRepository;
let sandbox;

before(() => {
  UserModel = require('modules/auth/data/model');
  authRepository = require('modules/auth/data');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('repository', () => {
          describe('findOne', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called', () => {
              let findOneStub;

              before('stub UserModel.findOne()', () => {
                findOneStub = sandbox.stub(UserModel, 'findOne')
                  .returns({
                    exec: () => {
                      return Promise.resolve({});
                    }
                  });
              });

              it('should call UserModel.findOne()', () => {
                return authRepository.findOne()
                  .then(() => {
                    findOneStub.callCount.should.equal(1);
                  });
              });
            });
          });
        });
      });
    });
  });
});
