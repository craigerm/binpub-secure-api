var config = {
  https: false,
  port: 3000,
  url_prefix: 'http://localhost', //'https://www.binpub.com';
  creds: {
    redis_port: undefined,
    redis_host: undefined,
    mongoose_auth: 'mongodb://localhost/binpub_test'
  }
};

// TODO (CM): 
// Add support for development, production and testing environments.
// We should load them and merge with the "default" application settings.
// Can use node.extend package.
// 
module.exports = config;
