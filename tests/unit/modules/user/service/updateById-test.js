const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let userService;
let userValidator;
let userRepository;
let userErrorMessages;
let InvalidArgumentError;
let ObjectNotFoundError;
let sandbox;

before(() => {
  userService = require('modules/user');
  userValidator = require('modules/user/validator');
  userRepository = require('modules/user/data');
  userErrorMessages = require('modules/user/constants/errorMessages');

  InvalidArgumentError = require('errors/invalidArgumentError');
  ObjectNotFoundError = require('errors/objectNotFoundError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
        describe('service', () => {
          describe('updateById', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when id is not passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return userService.updateById(id)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('id');
                  });
              });
            });

            describe('when options is not passed', () => {
              let id = '123';
              let options = null;

              it('should reject with an error', () => {
                return userService.updateById(id, options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when user does not exist', () => {
              let id = '123';
              let options = {};

              let findByIdStub;

              before('stub userRepository.findById()', () => {
                findByIdStub = sandbox.stub(userRepository, 'findById')
                  .returns(Promise.resolve(null));
              });

              it('should reject with an error', () => {
                return userService.updateById(id, options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(ObjectNotFoundError);
                    err.message.should.equal(userErrorMessages.USER_NOT_FOUND);

                    findByIdStub.callCount.should.equal(1);
                  });
              });
            });

            describe('when user exists', () => {
              describe('non null values are passed for update', () => {
                let id = '123';
                let options = {
                  firstName: 'FOOBAR'
                };

                let findByIdStub;
                let validateUpdateStub;
                let updateByIdStub;

                let user = {
                  id
                };

                before('stub userRepository.findById()', () => {
                  findByIdStub = sandbox.stub(userRepository, 'findById')
                    .returns(Promise.resolve(user));
                });

                before('stub userValidator.validateUpdate()', () => {
                  validateUpdateStub = sandbox.stub(userValidator, 'validateUpdate')
                    .returns(Promise.resolve({}));
                });

                before('stub userRepository.updateById()', () => {
                  updateByIdStub = sandbox.stub(userRepository, 'updateById')
                    .returns(Promise.resolve(user));
                });

                it('should resolve with the updated user', () => {
                  return userService.updateById(id, options)
                    .then(result => {
                      should.exist(result);

                      findByIdStub.callCount.should.equal(1);
                      validateUpdateStub.callCount.should.equal(1);
                      updateByIdStub.callCount.should.equal(1);
                      updateByIdStub.calledWith(id, options).should.equal(true);
                    });
                });
              });

              describe('null values are passed for update', () => {
                let id = '123';
                let options = {
                  email: null,
                  firstName: null
                };

                let findByIdStub;
                let validateUpdateStub;
                let updateByIdStub;

                let user = {
                  id
                };

                before('stub userRepository.findById()', () => {
                  findByIdStub = sandbox.stub(userRepository, 'findById')
                    .returns(Promise.resolve(user));
                });

                before('stub userValidator.validateUpdate()', () => {
                  validateUpdateStub = sandbox.stub(userValidator, 'validateUpdate')
                    .returns(Promise.resolve({}));
                });

                before('stub userRepository.updateById()', () => {
                  updateByIdStub = sandbox.stub(userRepository, 'updateById')
                    .returns(Promise.resolve(user));
                });

                it('should resolve with the updated user', () => {
                  return userService.updateById(id, options)
                    .then(result => {
                      should.exist(result);

                      findByIdStub.callCount.should.equal(1);
                      validateUpdateStub.callCount.should.equal(1);
                      updateByIdStub.callCount.should.equal(1);
                      updateByIdStub.calledWith(id, {
                        firstName: options.firstName
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
});
