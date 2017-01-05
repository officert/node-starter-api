const should = require('should');
const sinon = require('sinon');

let eventBus;
let InvalidArgumentError;
let sandbox;

before(() => {
  eventBus = require('modules/eventBus');

  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('eventBus', () => {
        describe('service', () => {
          describe('publish', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when event is not passed', () => {
              let event = null;

              it('should throw an error', () => {
                should(() => {
                  eventBus.publish(event);
                }).throw(new InvalidArgumentError('event'));
              });
            });

            describe('when event is passed', () => {
              let event = 'FOOBAR';
              let arg1 = '1';
              let arg2 = '2';

              let emitStub;

              before('stub eventBus._eventEmitter.emit()', () => {
                emitStub = sandbox.stub(eventBus._eventEmitter, 'emit');
              });

              it('should call eventBus._eventEmitter.emit()', () => {
                eventBus.publish(event, arg1, arg2);

                emitStub.callCount.should.equal(1);
                emitStub.calledWith(event, arg1, arg2).should.equal(true);
              });
            });
          });
        });
      });
    });
  });
});
