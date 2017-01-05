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
          describe('list', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when nothing is passed', () => {
              let findStub;

              before('stub UserModel.find()', () => {
                findStub = sandbox.stub(UserModel, 'find')
                  .returns({
                    exec: () => {
                      return Promise.resolve([{}]);
                    }
                  });
              });

              it('should call UserModel.find()', () => {
                return userRepository.list()
                  .then(() => {
                    findStub.callCount.should.equal(1);
                  });
              });
            });
          });
        });
      });
    });
  });
});
