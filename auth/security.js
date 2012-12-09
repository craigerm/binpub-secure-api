var session = require('./session');
var notAuthorizedData = { error: 'Not authorized' };
var NotAuthorizedError = require('../models/errors').NotAuthorizedError;

// This is a piece of middleware that makes sure we have an access
// token and a valid session for the user owning that token.
module.exports.authenticate = function(req, res, next) {

  var accessToken = req.params.accessToken;

  if(!accessToken) {
    return next(new NotAuthorizedError());
  }
  
  session.getUserByToken(accessToken, function(err, user) {
    if(err) throw err;
    if(!user) return next(new NotAuthorizedError());
   
    // Set user profile on the request. The user is now authenticated.  
    req.userProfile = user;
    next();
  });
};

// This is a piece of middleware that will make sure the session user
// is one of the owners of the item
module.exports.checkPermission = function(req, res, next) {
  if(req.params.userid == req.userProfile.username ) {
    return next();
  }
  next(new NotAuthorizedError());
};
