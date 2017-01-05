const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const logger = require('modules/logger');

class App {
  constructor() {
    this._initialized = false;
  }

  init() {
    if (this._initialized) {
      logger.warn('app already initialized');
      return;
    }

    const mongoDbConnection = require('src/data/connections/mongoDbConfig');

    return mongoDbConnection.init()
      .then(() => loadModules())
      .then(() => loadEventSubscribers())
      .then(() => {
        logger.info('App initialized...');

        this._initialized = true;
      });
  }
}

function loadEventSubscribers() {
  const userEventSubscribers = path.join(__dirname, '../', 'modules/user/events/subscribers');

  return Promise.all([
    requireDirectory(userEventSubscribers)
  ]);
}

function loadModules() {
  const modulesDirPath = path.join(__dirname, '../', 'modules');

  return requireDirectory(modulesDirPath);
}

function requireDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) return reject(err);

      files.map(dir => {
        let subDirPath = path.join(dirPath, dir);

        try {
          require(subDirPath);
        } catch (err) {
          logger.error(`Error loading module ${subDirPath}`);
          logger.error(err);
        }
      });

      return resolve(null);
    });
  });
}

module.exports = new App();
