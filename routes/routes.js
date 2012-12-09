module.exports = function (server, models) {
  
  console.log('starting routes');

  // Put any routing, response, etc. logic here. This allows us to define these functions
  // only once, and it will be re-used on both the HTTP and HTTPs servers
  var commits = require('./commits')
    , messages = require('./messages');

  //initialize passport
  console.log('pre auth');
  server = commits(server, models);
  server = messages(server, models);
  return server;
}
