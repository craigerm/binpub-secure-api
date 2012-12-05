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
  , permissionCheck = require('./auth/permissionCheck')
  , fs = require('fs')
  , util = require('util');

var url_prefix = config.url_prefix
  , connected = false
  , models = require('./models/models')(mongoose);

// These are global variables (probably will clean this up)
app = null;
Repo = models.Repo;
User = models.User;

mongoose.connect(config.creds.mongoose_auth);

mongoose.connection.on('open', function(){
  console.log("connected to MongoLab");
  connected = true;
});

var server_options = {};

if(config.https === true){
  server_options.key = fs.readFileSync('../signs/s3.key');
  server_options.certificate = fs.readFileSync('../signs/binpub.com.crt');
}

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');  
app = restify.createServer(server_options);

// The url must have the port becasue it must match the oauth callback
app.url_prefix = url_prefix + (config.port ? ':' + config.port : '');
app.use(restify.queryParser());
app.use(passport.initialize());

// On every request we check the authentication
app.use(permissionCheck);

// Set up our routes and start the server
app.use(function setDefaultHeaders(req, res, next){
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Set the port of the default
var port = config.port || (config.https === true ? 443 : 3000);

// Configure all the routes
require('./config/routes')(app);
   
// Our oAuth controllers
require('./controllers/auth-github-controller');

app.listen(port, function() {
  console.log('%s listening at %s, love & peace', app.name, app.url_prefix);
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// export the app (used for testing)
// Not sure if this is a good idea or not.
module.exports = app;

