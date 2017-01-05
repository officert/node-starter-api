module.exports = {
  env: 'production',
  data: {
    mongo: {
      database: process.env.MONGO_DB,
      host: process.env.MONGO_HOST
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
};
