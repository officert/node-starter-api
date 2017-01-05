const NODE_ENV = process.env.NODE_ENV || 'development';

const _ = require('lodash');

const envConfig = NODE_ENV === 'production' ? require('./prod.env.js') : (NODE_ENV === 'test' ? require('./test.env.js') : require('./dev.env.js'));

const config = _.assignIn({
  env: null,
  port: process.env.PORT || 3030,
  name: 'xxxx-replaceme-xxxx',
  data: {},
  jwt: {}
}, envConfig);

module.exports = config;
