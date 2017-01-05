const should = require('should');
const sinon = require('sinon');

let BaseRepository;
let InvalidArgumentError;
let sandbox;

before(() => {
  BaseRepository = require('modules/base/data');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('base', () => {
        describe('data', () => {
          describe('respository', () => {
            describe('constructor', () => {
              afterEach(() => {
                sandbox.restore();
              });

              describe('when instantiated without a model', () => {
                let model = null;

                it('should throw an InvalidArgumentError', () => {
                  should(() => {
                    new BaseRepository(model);
                  }).throw(new InvalidArgumentError('model'));
                });
              });

              describe('when instantiated with a model', () => {
                let Model = {};

                it('should create a new instance of BaseRepository', () => {
                  let instance = new BaseRepository(Model);

                  should.exist(instance);
                  instance.should.be.an.instanceOf(BaseRepository);
                });
              });
            });
          });
        });
      });
    });
  });
});
