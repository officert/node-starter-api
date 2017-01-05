module.exports = {
  env: 'test',
  data: {
    mongo: {
      database: 'xxxx-replaceme-xxxx',
      host: process.env.MONGO_PORT_27017_TCP_ADDR || '127.0.0.1',
      port: process.env.MONGO_PORT_27017_TCP_PORT || '27017'
    }
  },
  messaging: {
    postmark: {
      key: 'xxxxxxxxx',
      fromEmailAddress: 'xxxx-replaceme-xxxx'
    }
  },
  jwt: {
    secret: 'xxxx-replaceme-xxxx'
  }
};
