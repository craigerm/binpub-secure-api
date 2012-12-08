var config = {
  authCallback: 'http://localhost:3333/auth-callback',
  port: 80,
  url: process.env.BINPUB_API_URL, 
  creds: {
    redis_port: undefined, 
    redis_host: process.env.REDISTOGO_URL,
    mongoose_auth: process.env.MONGOLAB_URI
  }
};


module.exports = config;
