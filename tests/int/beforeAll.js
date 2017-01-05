const mongoose = require('mongoose');

const app = require('app');
const config = require('config');
const mongoDbConfig = require('src/data/connections/mongoDbConfig');

const logger = require('modules/logger');

require('./afterAll');

before(() => {
  let api;

  logger.log('starting app...');

  return app.init()
    .then(() => {
      api = require('api');

      return api.init();
    })
    .then(() => {
      const requestAgent = require('tests/utils/requestAgent');

      requestAgent.init(api._expressApp);
    })
    .catch(err => {
      logger.error(err);
    });
});

before(next => {
  logger.log('dropping database...');

  let conn = mongoose.createConnection(mongoDbConfig.createMongoUri({
    host: config.data.mongo.host,
    port: config.data.mongo.port,
    database: config.data.mongo.database
  }));

  conn.once('open', () => {
    conn.db.dropDatabase(err => {
      if (err) return next(err);

      logger.log('database dropped');

      conn.close(() => next());
    });
  });
});
