var secret = require('../secret/secret')
  , encryption = require('../auth/encryption')
  , passport = require('passport')
  , util = require('util')
  , GitHubStrategy = require('passport-github').Strategy;

var GITHUB_CLIENT_ID = secret.github_client_id;
var GITHUB_CLIENT_SECRET = secret.github_client_secret;
var GITHUB_CALLBACK_URL = app.url_prefix + '/auth/github/callback';
var GITHUB_LOGIN_URL = app.url_prefix + '/auth/github';

// We want to authenticate the github and callback events
// (THIS IS NOT IMPLEMENTED YET. It is working for express but not for restify
// yet.)
module.exports.before = [
  { method: passport.authenticate('github'), only: ['github', 'callback'] }
];

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, done){
    console.log('accessToken=%s, github id=%', accessToken, profile.id);
  
    // Example for now: keep entire github profile
    return done(null, profile);
  }
));

// TODO: Clean up the route configuration
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
    passport.authenticate('github'),
    function(req, res, next){
      // Now that we are authenticated
      // we need to save the details into the user table
      // and create a session.
      res.send(200);
      return next();
    }
);

module.exports.auth = passport.authenticate('github');

module.exports.callback = function(req, res, next){
  return next();
};
