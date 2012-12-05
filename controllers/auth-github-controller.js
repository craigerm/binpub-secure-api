var secret = require('../secret/secret')
  , encryption = require('../auth/encryption')
  , passport = require('passport')
  , session = require('../auth/session')
  , util = require('util')
  , GitHubStrategy = require('passport-github').Strategy

var GITHUB_CLIENT_ID = secret.github_client_id;
var GITHUB_CLIENT_SECRET = secret.github_client_secret;
var GITHUB_CALLBACK_URL = app.url_prefix + '/auth/github/callback';
var GITHUB_LOGIN_URL = app.url_prefix + '/auth/github';

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
    User.syncGitHubProfile(profile, function(err){
      var user = {
        id: profile.id, 
        username: profile.username,
        accessToken: accessToken
      };
      session.addUser(accessToken, user);
      return done(err, user);      
    });
  }
));

// TODO: Clean up the route configuration
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
    passport.authenticate('github'),
    function(req, res, next){
      var redirectUrl = util.format(
        '/auth-callback?login=%s&accessToken=%s',
        req.user.username,
        req.user.accessToken);
      res.header('Location', redirectUrl);
      res.send(302);
      return next();
    }
);

app.get('/auth-callback', function(req, res, next) {
    res.send(200);
    next();
});

