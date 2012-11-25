var passport = require('passport');
var session = require('./session');
var Step = require('step');
var keys = require('keygrip')();
var Cookies = require('cookies');

exports.authenticate = function authenticate(req, res, next) {
  var cookies = new Cookies(req, res, keys);
  console.log('AUTHENTICATE');
  console.log(req.url);
  
  if(/github_callback/.test(req.url)){
    console.log('GITHUB CALLBACK');
    var userData = {};
	userData.date = new Date();
	userData.GH = req.params.code;
	Step(
	  function findOrCreate(){
	    console.log(userData);
        session.findOrCreateUser(userData, this);
	},
	  function setCookie(){
	    console.log('set cookie');
		next();
	});
  }
  
  else { next(); }
}




exports.stampPassport = function stampPassport() {
  passport.serializeUser(function(user, done) {
    console.log('serialize user');
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    console.log('deserialize user')
    done(null, obj);
  });
} 

module.exports.setup =  function(app) {
  console.log('setting up authorization strategy');
  var secret = require('../secret/secret') 
    , GH_CLIENT_ID = secret.github_client_id
    , GH_CLIENT_SECRET = secret.github_client_secret
    , SERVER_PREFIX = app.url_prefix
    , GitHubStrategy = require('passport-github').Strategy 
	, GH_LOGIN_PATH = '/auth/github'
    , GH_CALLBACK_PATH = '/api/github_callback';

  app.use(passport.initialize());
  console.log('passport initialized');
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.

gh_handler = passport.authenticate('github');

gh_callback_handler2 = function(req, res) {
    console.log('we b log in agin!');
	console.dir(req.user.displayName);
	//be sure to send a response
	res.send(req.user);
}
// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
  console.log("callback url: "+ SERVER_PREFIX+ GH_CALLBACK_PATH);
  passport.use(new GitHubStrategy({
    clientID: GH_CLIENT_ID,
    clientSecret: GH_CLIENT_SECRET,
    callbackURL: SERVER_PREFIX + GH_CALLBACK_PATH
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
console.log('passport guthub strategy setup');

app.get(GH_LOGIN_PATH, gh_handler);
app.get(GH_CALLBACK_PATH, gh_handler, gh_callback_handler2);





return app;


};