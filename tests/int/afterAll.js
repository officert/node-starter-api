after(() => {
  const api = require('api');

  return api.shutdown();
});
