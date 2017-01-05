const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let UserModel;
let userRepository;
let InvalidArgumentError;
let sandbox;

before(() => {
  UserModel = require('modules/user/data/model');
  userRepository = require('modules/user/data');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
        describe('repository', () => {
          describe('deleteById', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when no id is passed', () => {
              let id = null;

              it('should reject with an error', () => {
                return userRepository.deleteById(id)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('id');
                  });
              });
            });

            describe('when no options are passed', () => {
              let id = '123';
              let findOneAndUpdateStub;

              before('stub UserModel.findOneAndUpdate()', () => {
                findOneAndUpdateStub = sandbox.stub(UserModel, 'findOneAndUpdate')
                  .returns(Promise.resolve([{}]));
              });

              it('should call UserModel.findOneAndUpdate() with delete:true', () => {
                return userRepository.deleteById(id)
                  .then(() => {
                    findOneAndUpdateStub.callCount.should.equal(1);
                    findOneAndUpdateStub.calledWith({
                      _id: id
                    }, {
                      deleted: true
                    }, {
                      new: true
                    }).should.equal(true);
                  });
              });
            });

            describe('when options.soft:false is passed', () => {
              let id = '123';
              let options = {
                soft: false
              };
              let removeStub;

              before('stub UserModel.remove()', () => {
                removeStub = sandbox.stub(UserModel, 'remove')
                  .returns(Promise.resolve([{}]));
              });

              it('should call UserModel.remove()', () => {
                return userRepository.deleteById(id, options)
                  .then(() => {
                    removeStub.callCount.should.equal(1);
                    removeStub.calledWith({
                      _id: id
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
