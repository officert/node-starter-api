const Promise = require('bluebird');

const httpServer = require('api/httpServer');
const logger = require('modules/logger');
const InternalServerError = require('errors/internalServerError');

class Api {
  constructor() {
    this._initialized = false;
  }

  /**
   * @return {Promise<null>}
   */
  init() {
    if (this._initialized) {
      logger.warn('api already initialized');
      return;
    }

    return httpServer.init()
      .tap(expressApp => {
        this._expressApp = expressApp;

        logger.info('Api initialized...');

        this._initialized = true;
      });
  }

  /**
   * @return {Promise<null>}
   */
  shutdown() {
    if (!this._initialized) return Promise.reject(new InternalServerError('api has not been initialized'));

    return httpServer.shutdown();
  }

  get expressApp() {
    if (!this._initialized) return Promise.reject(new InternalServerError('api has not been initialized'));

    return this._expressApp;
  }
}

module.exports = new Api();
