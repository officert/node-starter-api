const request = require('supertest');

class RequestAgent {
  init(app) {
    this._agent = request(app);
  }

  get agent() {
    return this._agent;
  }
}

module.exports = new RequestAgent();
