const sinon = require('sinon');
const Promise = require('bluebird');

let AuthModel;
let authRepository;
let sandbox;

before(() => {
  AuthModel = require('modules/auth/data/model');
  authRepository = require('modules/auth/data');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('repository', () => {
          describe('list', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when nothing is passed', () => {
              let findStub;

              before('stub AuthModel.find()', () => {
                findStub = sandbox.stub(AuthModel, 'find')
                  .returns({
                    exec: () => {
                      return Promise.resolve([{}]);
                    }
                  });
              });

              it('should call AuthModel.find()', () => {
                return authRepository.list()
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
