// This method will make sure the users is authenticated for any http
// method that changes data (i.e. POST, DELETE, etc.). Other requests (GET)
// will be allowed. A user is allowed if the request has an accessToken param
// that has a user in a redis session that has the same username as in the
// request;
var NotAuthorizedError = require('../models/errors')
  , session = require('./session');

var secureMethods = ['POST','PUT','PATCH','DELETE'];

function notAuthorized(res) {
  res.send(401, { error: 'Not authorized' });
};

module.exports = function(req, res, next) {
  // If the method is say GET, we always allow it.
  // This matched the security system for Ost API.
  if(secureMethods.indexOf(req.method) == -1){
    return next();
  }

  var accessToken = req.params.accessToken;
  if(!accessToken) {
    return notAuthorized(res);
  }

  // Check if user associated with token is the user that
  // the API call is trying to modify.
  session.getUserByToken(accessToken, function(err, user) {
    if(err)
      throw err;
    if(!user) {
      return notAuthorized(res);
    }

    if(user.username != req.params.userid) {
      return notAuthorized(res);
    }
    
    // User is allowed to change this user
    return next();
  });
};

