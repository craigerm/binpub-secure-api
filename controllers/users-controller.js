var util = require('util');

// GET /users/:username
exports.show = function(username, req, res, next){
  User.findOneByUsername(username, function(err, user) {
    next(err || user);
 });
};

// PUT /users/:username
exports.update = function(username, req, res, next){
  return next();
};

// DELETE /users/:username
exports.destroy = function(username, req, res, next){
  return next();
};
