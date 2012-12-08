var config = require('../config/application')
  , encryption = require('../auth/encryption')
  , passport = require('passport')
  , session = require('../auth/session')
  , util = require('util')
  , GitHubStrategy = require('passport-github').Strategy

var GITHUB_CLIENT_ID = process.env.GITHUB_APP_ID
  , GITHUB_CLIENT_SECRET = process.env.GITHUB_APP_SECRET
  , GITHUB_CALLBACK_URL = config.url_prefix + '/auth/github/callback'
  , GITHUB_LOGIN_URL = config.url_prefix + '/auth/github';

// Middleware
module.exports.before = [
  { method: passport.authenticate('github'), only: 'callback' }
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
    // Switch this to use a simpler model instead of the whole profile
    User.syncGitHubProfile(profile, function(err, user){
      var userData = {
        id: user._id,
        githubId: profile.id, 
        username: profile.username,
        accessToken: accessToken
      };
      session.addUser(accessToken, userData);
      return done(err, userData);      
    });
  }
));

// GET /auth/github
module.exports.auth = passport.authenticate('github');

// GET /auth/github/callback?code=[code]
module.exports.callback = function(req, res, next) {

  var redirectUrl = util.format('%s/?login=%s&accessToken=%s', 
    config.authCallback,
    req.user.username,
    req.user.accessToken);

  res.header('Location', redirectUrl);
  res.send(302);
};

