const should = require('should');
const sinon = require('sinon');

let userValidator;
let InvalidArgumentError;
let sandbox;

before(() => {
  userValidator = require('modules/user/validator');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
        describe('validator', () => {
          describe('validateCreate', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when no options are passed', () => {
              let options = null;

              it('should throw an InvalidArgumentError', () => {
                return userValidator.validateCreate(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options');
                  });
              });
            });

            describe('when options.email is not passed', () => {
              let options = {
                email: null
              };

              it('should throw an InvalidArgumentError', () => {
                return userValidator.validateCreate(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.email');
                  });
              });
            });

            describe('when invalid email is passed', () => {
              let options = {
                email: 'asdfasdfasdf'
              };

              it('should throw an InvalidArgumentError', () => {
                return userValidator.validateCreate(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.email');
                  });
              });
            });

            describe('when options.firstName is not a string', () => {
              let options = {
                email: 'foo@foo.com',
                firstName: 1
              };

              it('should throw an InvalidArgumentError', () => {
                return userValidator.validateCreate(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.firstName');
                  });
              });
            });

            describe('when options.lastName is not a string', () => {
              let options = {
                email: 'foo@foo.com',
                lastName: 1
              };

              it('should throw an InvalidArgumentError', () => {
                return userValidator.validateCreate(options)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('options.lastName');
                  });
              });
            });

            describe('when all required params are passed', () => {
              let options = {
                email: 'foo@foo.com',
                authId: '12345'
              };

              it('should return an object with the validation data', () => {
                return userValidator.validateCreate(options)
                  .then(validationData => {
                    should.exist(validationData);
                  });
              });
            });
          });
        });
      });
    });
  });
});
