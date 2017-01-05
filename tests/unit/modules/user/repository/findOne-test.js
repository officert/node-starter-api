const sinon = require('sinon');
const Promise = require('bluebird');

let UserModel;
let userRepository;
let sandbox;

before(() => {
  UserModel = require('modules/user/data/model');
  userRepository = require('modules/user/data');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
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
                return userRepository.findOne()
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
