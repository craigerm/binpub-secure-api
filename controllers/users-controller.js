var util = require('util');

// GET /users/:username
exports.show = function(username, req, res, next){
  User.findOneByUsername(username, next); 
};

// PUT /users/:username
exports.update = function(username, req, res, next){
  next();
};

// DELETE /users/:username
exports.destroy = function(username, req, res, next){
  next();
};
