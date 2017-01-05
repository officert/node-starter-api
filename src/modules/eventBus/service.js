const EventEmitter = require('events');
const InvalidArgumentError = require('errors/invalidArgumentError');

class EventBus {
  constructor() {
    this._eventEmitter = new EventEmitter();
  }

  publish(event, ...args) {
    if (!event) throw new InvalidArgumentError('event');

    this._eventEmitter.emit(event, ...args);
  }

  subscribe(event, handler) {
    if (!event) throw new InvalidArgumentError('event');
    if (!handler) throw new InvalidArgumentError('handler');

    this._eventEmitter.on(event, handler);
  }
}

module.exports = new EventBus();
