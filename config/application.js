var fs = require('fs')
  , extend = require('xtend');

var config = {
  https: false,
  port: 3000,
  url_prefix: 'http://localhost:3000', //'https://www.binpub.com';
  authCallback: 'http://localhost:3333/auth-callback', // Redirect to client app
  creds: {
    redis_port: undefined,
    redis_host: undefined,
    mongoose_auth: 'mongodb://localhost/binpub_dev'
  }
};

// Environemnt might not be set. It nof we set it to development
var environment = process.env.NODE_ENV || 'development';
var configFile =  './config/' + environment + '.js';

// Try and load the environment specific options and merge them to the config. 
// We mainly do this for testing so we can have a "test" database that is wiped
// clean.
if(environment && fs.existsSync(configFile)) {
  console.log('Loading %s config settings...', environment);
  var environmentConfig = require('./' + environment); 
  config = extend({}, config, environmentConfig);
}

module.exports = config;
