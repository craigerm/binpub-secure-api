module.exports = function (server, models) {
  
  console.log('starting routes');

  // Put any routing, response, etc. logic here. This allows us to define these functions
  // only once, and it will be re-used on both the HTTP and HTTPs servers
  var auth = require('../auth/auth')
    , posts = require('./posts')
    , users = require('./users')
    , repos = require('./repos')
    , topics = require('./topics')
    , commits = require('./commits')
    , messages = require('./messages');

  //initialize passport
  console.log('pre auth');
  server = auth.setup(server);
  server = posts(server, models);
  server = topics(server, models);
  server = commits(server, models);
  server = repos(server, models);
  server = users(server, models);
  server = messages(server, models);
  return server;
}
