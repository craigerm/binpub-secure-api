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

  var accessToken = req.params.accessToken;
  if(!accessToken && secureMethods.indexOf(req.method) == -1 && req.params.userid != 'me') {
    return next();
  }

  if(!accessToken) {
    return notAuthorized(res);
  }

  // Check if user associated with token is the user that
  // the API call is trying to modify.
  session.getUserByToken(accessToken, function(err, user) {
    if(err) throw err;
    if(!user) return notAuthorized(res);

    var userId = req.params.userid || req.params.login;

    if(req.params.userid != 'me' && user.username != userId) {
      return notAuthorized(res);
    }
    
    // User is allowed to change this user so add the user data to the request
    // and return 
    req.userProfile = user; 
    return next();
  });
};

