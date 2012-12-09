var url = require('url')
  , redisUrl = url.parse(process.env.REDISTOGO_URL);

var config = {
  authCallback: process.env.BINPUB_AUTH_CALLBACK,
  port: process.env.PORT || 3000,
  url_prefix: process.env.BINPUB_API_URL, 
  creds: {
    redis_auth: redisUrl.auth.split(':')[1],
    redis_port: redisUrl.port,
    redis_host: redisUrl.hostname,
    mongoose_auth: process.env.MONGOLAB_URI
  }
};


module.exports = config;
