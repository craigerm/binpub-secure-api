var util = require('util');

// GET /users/:username
exports.show = function(req, res, next){
  User.findOneByUsername(req.params.userid, next); 
};

//// PUT /users/:username
//exports.update = function(req, res, next){
//  next();
//};

//// DELETE /users/:username
//exports.destroy = function(req, res, next){
//  next();
//};
