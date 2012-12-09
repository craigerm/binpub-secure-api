var util = require('util')
  , security = require('../auth/security');

module.exports.before = [
  { method: security.authenticate, except: ['show'] },
];

// GET /users/me
module.exports.showCurrent = function(req, res, next) {
  security.authenticate(req, res, function(err) {
    if(err) return next(err);
    User.findOneByUsername(req.userProfile.username, next);
  });
};

// GET /users/:username
module.exports.show = function(req, res, next) {
  // Special case for 'me'.
  if(req.params.userid == 'me') {
    return module.exports.showCurrent(req, res, next);
  }
  User.findOneByUsername(req.params.userid, next);
};

// DELETE /users/:username
module.exports.destroy = function(req, res, next){
  User.removeWithRelated(req.userProfile.id, next);
};
