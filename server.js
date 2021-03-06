/**
 * Last chance to catch an error
 */
process.on('uncaughtException', function(err) {
  console.log("uncaught exception: " + err);
  console.log(err.stack);
});

var mongoose = require('mongoose')
  , config = require('./config/application.js')
  , passport = require('passport')
  , autoIncrementPlugin = require('./models/plugins/autoIncrementPlugin')
  , fs = require('fs')
  , util = require('util');

var app = null
  , connected = false
  , models = require('./models/models')(mongoose);

// These are global variables (clean this up!)
Repo = models.Repo;
User = models.User;
Topic = models.Topic;
Post = models.Post;

mongoose.connect(config.creds.mongoose_auth);

mongoose.connection.on('open', function(){
  console.log("connected to MongoLab");
  connected = true;
});

// Initialize the plugins
autoIncrementPlugin.init(mongoose);

var server_options = {};

if(config.https === true){
  server_options.key = fs.readFileSync('../signs/s3.key');
  server_options.certificate = fs.readFileSync('../signs/binpub.com.crt');
}

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');  
app = restify.createServer(server_options);

// The url must have the port becasue it must match the oauth callback
app.use(restify.queryParser());
app.use(restify.bodyParser());
app.use(passport.initialize());

// Set up our routes and start the server
app.use(function setDefaultHeaders(req, res, next){
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Configure all the routes
require('./config/routes')(app);

app.listen(config.port, function() {
  console.log('%s listening at %s, love & peace', app.name, config.url_prefix);
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// export the app (used for testing)
// Not sure if this is a good idea or not.
module.exports = app;

