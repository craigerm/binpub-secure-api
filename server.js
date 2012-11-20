/**
 * Last chance to catch an error
 */
process.on('uncaughtException', function(err) {
console.log("uncaught exception: " + err);
console.log(err.stack);
});
// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var mongoose = require('mongoose');
var config = require('./secret/config'); // Local config file to hide creds
var connected = false;
mongoose.connect(config.creds.mongoose_auth);
mongoose.connection.on('open', function(){
  console.log("connected to MongoLab");
  connected = true;
  var fs = require('fs')
    , util = require('util')
    , routes = require('./routes/routes')
	, models = require('./models/models')(mongoose)
    , url_prefix = 'https://www.binpub.com';
  
  var https_options = {
    key: fs.readFileSync('../signs/s3.key'),
    certificate: fs.readFileSync('../signs/binpub.com.crt')
  };

// require restify and bodyParser to read Backbone.js syncs
  var restify = require('restify');  
  var https_server = restify.createServer(https_options);
  https_server.url_prefix = url_prefix;
  https_server.use(restify.queryParser());


// Set up our routes and start the server
https_server = routes(https_server,  models);

  https_server.listen(443, function() {
    console.log('%s listening at %s, love & peace', https_server.name, https_server.url_prefix);
  });
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
