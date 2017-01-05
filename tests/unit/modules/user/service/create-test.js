const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let userService;
let userValidator;
let userRepository;
let InvalidArgumentError;
let sandbox;

before(() => {
  userService = require('modules/user');
  userValidator = require('modules/user/validator');
  userRepository = require('modules/user/data');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
        describe('service', () => {
          describe('create', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when options is not passed', () => {
              let options = null;

              it('should reject with an error', () => {
                return userService.create(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when options is passed', () => {
              let options = {
                email: 'foo@foo.com',
                firstName: 'John',
                lastName: 'Doe'
              };

              let validateCreateStub;

              let validationData = {};

              let createStub;

              let user = {};

              before('stub userValidator.validateCreate', () => {
                validateCreateStub = sandbox.stub(userValidator, 'validateCreate')
                  .returns(Promise.resolve(validationData));
              });

              before('stub userRepository.create', () => {
                createStub = sandbox.stub(userRepository, 'create')
                  .returns(Promise.resolve(user));
              });

              it('should call userRepository.create()', () => {
                return userService.create(options)
                  .then(newUser => {
                    should.exist(newUser);
                    newUser.should.deepEqual(user);

                    validateCreateStub.callCount.should.equal(1);
                    createStub.callCount.should.equal(1);
                    createStub.calledWith({
                      email: options.email,
                      firstName: options.firstName,
                      lastName: options.lastName
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
