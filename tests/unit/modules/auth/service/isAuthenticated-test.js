const should = require('should');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

let authService;
let authRepository;
let InvalidArgumentError;
let sandbox;

before(() => {
  authService = require('modules/auth');
  authRepository = require('modules/auth/data');
  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('auth', () => {
        describe('service', () => {
          describe('isAuthenticated', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when called with no token', () => {
              let token = null;

              it('should return an error', () => {
                return authService.isAuthenticated(token)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('token');
                  });
              });
            });

            describe('when called with a token', () => {
              let token = '1234';
              let userId = '5678910';

              let verifyStub;
              let findOneStub;

              let decoded = {
                userId
              };
              let auth = {
                user: userId
              };

              before('stub jwt.verify()', () => {
                verifyStub = sandbox.stub(jwt, 'verify');
                verifyStub.callsArgWith(2, null, decoded);
              });

              before('stub authRepository.findOne()', () => {
                findOneStub = sandbox.stub(authRepository, 'findOne')
                  .returns(Promise.resolve(auth));
              });

              it('should return an auth object', () => {
                return authService.isAuthenticated(token)
                  .then(result => {
                    should.exist(result);

                    verifyStub.callCount.should.equal(1);
                    findOneStub.callCount.should.equal(1);
                    findOneStub.calledWith({
                      user: auth.user
                    }).should.equal(true);
                  });
              });
            });
          });
        });
      });
    });
  });
});
