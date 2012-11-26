var passport = require('passport');
var session = require('./session');
var Step = require('step');
var keys = require('keygrip')();
var Cookies = require('cookies');
var encryption = require('./encryption');

exports.authenticate = function authenticate(req, res, next) {
  var cookies = new Cookies(req, res, keys);
  var credentials = cookies.get('credentials', {signed: true});
  console.log('AUTHENTICATE');
  console.log(credentials);
  
  if (credentials != undefined) {
    req.credentials = JSON.parse(credentials);
	next();
  } else{
     next(); 
  }
};




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

gh_handler = passport.authenticate('github', { session: false });

gh_callback_handler2 = function(req, res) {
      res.cookies = new Cookies(req, res, keys);
      console.log('GITHUB CALLBACK');
	  console.log(req.user);
      var userData = {};
	  userData.date = new Date();
	  userData.id = req.user.id;
	  userData.username = req.user.username;
	  userData.provider = 'github';
	  userData.hash = encryption.hash('password');
	  Step(
	    function findOrCreate(){
	      console.log(userData);
          session.findOrCreateUser(userData, this);
	  },
	    function setCookie(err, reply){
		  if (err) throw err;
	      console.log('set cookie');
		  cookies.set('credentials', JSON.stringify(userData.hash)); 
		  console.log(reply);
		  res.send(req.user);
	  });

    console.log('we b log in agin!');
	console.dir(req.user.displayName);
	//be sure to send a response

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