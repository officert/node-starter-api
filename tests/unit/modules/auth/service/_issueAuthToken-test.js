const should = require('should');
const sinon = require('sinon');

let authService;
let InvalidArgumentError;
let sandbox;

before(() => {
  authService = require('modules/auth');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('service', () => {
          describe('_issueAuthToken', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called with userId', () => {
              let userId = null;

              it('should return an error', () => {
                return authService._issueAuthToken(userId)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('userId');
                  });
              });
            });

            describe('when called with a userId', () => {
              let userId = '1234';

              it('should return an auth token', () => {
                return authService._issueAuthToken(userId)
                  .then(result => {
                    should.exist(result);
                  });
              });
            });
          });
        });
      });
    });
  });
});
