const should = require('should');
const sinon = require('sinon');

let github;
let InvalidArgumentError;
let sandbox;

before(() => {
  github = require('modules/libs/github');
  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('unit', () => {
  describe('modules', () => {
    describe('libs', () => {
      describe('github', () => {
        describe('getUserInfo', () => {
          afterEach(() => {
            sandbox.restore();
          });

          describe('when called without an accessToken', () => {
            let accessToken = null;

            it('should reject with an error', () => {
              github.getUserInfo(accessToken)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('accessToken');
                });
            });
          });

          describe('when called with an accessToken', () => {
            let accessToken = '123';

            let authenticateStub;
            let usersGetStub;

            let expectedResult = {
              firstName: 'John',
              lastName: 'Doe',
              email: 'jdoe@gmail.com',
              profilePicture: 'http://foobar.com'
            };
            let githubResponse = {
              name: `${expectedResult.firstName} ${expectedResult.lastName}`,
              email: expectedResult.email,
              avatar_url: expectedResult.profilePicture
            };

            before('stub _client.authenticate()', () => {
              authenticateStub = sandbox.stub(github._client, 'authenticate');
            });

            before('stub _client.users.get()', () => {
              usersGetStub = sandbox.stub(github._client.users, 'get');
              usersGetStub.callsArgWith(1, null, githubResponse);
            });

            it('should call _client.authenticate() and _client.users.get()', () => {
              return github.getUserInfo(accessToken)
                .then(result => {
                  should.exist(result);
                  result.should.deepEqual(expectedResult);

                  authenticateStub.callCount.should.equal(1);
                  usersGetStub.callCount.should.equal(1);
                });
            });
          });
        });
      });
    });
  });
});
