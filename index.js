const app = require('app');

const logger = require('modules/logger');

app.init()
  .then(() => {
    const api = require('api');

    return api.init();
  })
  .catch(err => {
    logger.error(err);

    process.exit(1);
  });
