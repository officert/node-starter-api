module.exports = {
  env: 'development',
  data: {
    mongo: {
      database: 'xxxx-replaceme-xxxx',
      host: process.env.WERCKER_MONGODB_HOST || '127.0.0.1',
      port: process.env.WERCKER_MONGODB_PORT || '27017'
    }
  },
  messaging: {
    postmark: {
      key: 'xxxx-replaceme-xxxx',
      fromEmailAddress: 'xxxx-replaceme-xxxx'
    }
  },
  jwt: {
    secret: 'xxxx-replaceme-xxxx'
  }
};
