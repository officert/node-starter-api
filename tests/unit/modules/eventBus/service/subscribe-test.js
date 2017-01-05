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
          describe('subscribe', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when event is not passed', () => {
              let event = null;

              it('should throw an error', () => {
                should(() => {
                  eventBus.subscribe(event);
                }).throw(new InvalidArgumentError('event'));
              });
            });

            describe('when handler is not passed', () => {
              let event = 'FOOBAR';
              let handler = null;

              it('should throw an error', () => {
                should(() => {
                  eventBus.subscribe(event, handler);
                }).throw(new InvalidArgumentError('handler'));
              });
            });

            describe('when event and handler are passed', () => {
              let event = 'FOOBAR';
              let handler = () => {};

              let onStub;

              before('stub eventBus._eventEmitter.on()', () => {
                onStub = sandbox.stub(eventBus._eventEmitter, 'on');
              });

              it('should call eventBus._eventEmitter.on()', () => {
                eventBus.subscribe(event, handler);

                onStub.callCount.should.equal(1);
                onStub.calledWith(event, handler).should.equal(true);
              });
            });
          });
        });
      });
    });
  });
});
