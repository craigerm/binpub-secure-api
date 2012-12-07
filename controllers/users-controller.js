var util = require('util');

// GET /users/:username
exports.show = function(req, res, next){
  User.findOneByUsername(req.params.userid, next); 
};

// DELETE /users/:username
exports.destroy = function(req, res, next){
  User.removeWithRelated(req.userProfile.id, next);
};
