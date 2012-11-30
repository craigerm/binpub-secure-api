/**
 * Last chance to catch an error
 */
process.on('uncaughtException', function(err) {
  console.log("uncaught exception: " + err);
  console.log(err.stack);
});

// Setup mongoose and the database
var mongoose = require('mongoose');
var config = require('./config/application.js');
var connected = false;

mongoose.connect(config.creds.mongoose_auth);

//mongoose.connection.on('open', function(){
  console.log("connected to MongoLab");
  connected = true;
  var fs = require('fs')
    , util = require('util')
  	, auth = require('./auth/auth')
	  , models = require('./models/models')(mongoose)
    , url_prefix = config.url_prefix;

  var server_options = {};

  if(config.https === true){
    server_options.key = fs.readFileSync('../signs/s3.key');
    server_options.certificate = fs.readFileSync('../signs/binpub.com.crt');
  }

  // require restify and bodyParser to read Backbone.js syncs
  var restify = require('restify');  
  var server = restify.createServer(server_options);
  server.url_prefix = url_prefix;
  server.use(restify.queryParser());

  // Set up our routes and start the server
  server.use(function setDefaultHeaders(req, res, next){
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // Set the port of the default
  var port = config.port || (config.https === true ? 443 : 3000);

  // Authenticate
  server.use(auth.authenticate);

  // Configure all the routes
  require('./config/routes')(server);

  //server = routes(server,  models);   
  server.listen(port, function() {
    console.log('%s listening at %s:%s, love & peace', server.name, server.url_prefix, port);
  });

//});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// export the server
module.exports = server;

