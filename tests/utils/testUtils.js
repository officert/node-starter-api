const path = require('path');
const should = require('should');

const config = require('config');
const logger = require('modules/logger');

module.exports = {
  getApiUrl(apiPath) {
    return `http://localhost:${config.port}` + path.join('/', apiPath);
  },
  expectError(httpStatus, errorMessage) {
    if (!httpStatus) throw new Error('httpStatus');

    return function(response) {
      should.exist(response);

      let statusCode = response.statusCode;
      should.exist(statusCode);

      let body = response.body;
      should.exist(body);

      logger.info(body);

      statusCode.should.equal(httpStatus);

      if (errorMessage) {
        body.should.have.property('errors');
        body.errors.length.should.be.above(0);
        body.errors[0].should.equal(errorMessage);
      }
    };
  }
};
