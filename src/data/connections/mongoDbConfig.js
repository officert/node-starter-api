const mongoose = require('mongoose');
const Promise = require('bluebird');

const logger = require('modules/logger');
const config = require('config');

mongoose.Promise = Promise;

class MongoConfig {
  constructor() {
    this._initialized = false;
  }

  init() {
    if (this._initialized) {
      logger.warn('Mongo DB already initialized');
      return;
    }

    this._connection = mongoose.connect(`mongodb://${config.data.mongo.host}/${config.data.mongo.database}`);

    logger.info('Mongo DB initialized...');

    this._initialized = true;

    return Promise.resolve(this._connection);
  }

  getConnection() {
    if (!this._initialized) throw new Error('mongoConfig not initialized');
    return this._connection;
  }

  createMongoUri(options = {}) {
    let uri = 'mongodb://';

    if (options.username && options.password) uri += `${options.username}:${options.password}@`;

    if (options.host && options.port) {
      uri += `${options.host}:${options.port}`;
    }

    if (options.database) uri += `/${options.database}`;

    if (options.replicaSet) uri += `?replicaSet=${options.replicaSet}`;

    return uri;
  }
}

module.exports = new MongoConfig();
