const should = require('should');
const sinon = require('sinon');
const googleApis = require('googleapis');

let google;
let InvalidArgumentError;
let GoogleApiError;
let sandbox;

before(() => {
  google = require('modules/libs/google');
  InvalidArgumentError = require('errors/invalidArgumentError');
  GoogleApiError = require('modules/libs/google/errors/apiError');

  sandbox = sinon.sandbox.create();
});

describe('unit', () => {
  describe('modules', () => {
    describe('libs', () => {
      describe('google', () => {
        describe('getUserInfo', () => {
          afterEach(() => {
            sandbox.restore();
          });

          describe('when called without an accessToken', () => {
            let accessToken = null;

            it('should reject with an error', () => {
              google.getUserInfo(accessToken)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('accessToken');
                });
            });
          });

          describe('when called with an accessToken', () => {
            describe('and google rejects with an error', () => {
              let accessToken = '123';
              let googleOauth2Stub;
              let googleGetStub;
              let errorMessage = 'Something bad happened';

              before('stub google.people.get', () => {
                googleGetStub = sandbox.stub().callsArgWith(1, new GoogleApiError(errorMessage));

                googleOauth2Stub = sandbox.stub(googleApis, 'plus', () => {
                  return {
                    people: {
                      get: googleGetStub
                    }
                  };
                });
              });

              it('should reject with an error', () => {
                return google.getUserInfo(accessToken)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(GoogleApiError);
                    err.message.should.equal(errorMessage);

                    googleOauth2Stub.callCount.should.equal(1);
                    googleGetStub.callCount.should.equal(1);
                  });
              });
            });

            describe('and google resolves with a response', () => {
              let accessToken = '123';
              let googleOauth2Stub;
              let googleGetStub;
              let expectedResult = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'jdoe@gmail.com',
                profilePicture: 'http://foobar.com'
              };
              let googleResponse = {
                name: {
                  givenName: expectedResult.firstName,
                  familyName: expectedResult.lastName
                },
                emails: [{
                  value: expectedResult.email
                }],
                image: {
                  url: expectedResult.profilePicture
                }
              };

              before('stub google.people.get', () => {
                googleGetStub = sandbox.stub().callsArgWith(1, null, googleResponse);

                googleOauth2Stub = sandbox.stub(googleApis, 'plus', () => {
                  return {
                    people: {
                      get: googleGetStub
                    }
                  };
                });
              });

              it('should resolve with an object', () => {
                return google.getUserInfo(accessToken)
                  .then(result => {
                    should.exist(result);
                    result.should.deepEqual(expectedResult);

                    googleOauth2Stub.callCount.should.equal(1);
                    googleGetStub.callCount.should.equal(1);
                  });
              });
            });
          });
        });
      });
    });
  });
});
