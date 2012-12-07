var util = require('util');

// GET /users/:username
exports.show = function(req, res, next){
  if(req.params.userid == 'me') {
    User.findById(req.userProfile.id, next);
  } else {
    User.findOneByUsername(req.params.userid, next); 
  }
};

// DELETE /users/:username
exports.destroy = function(req, res, next){
  User.removeWithRelated(req.userProfile.id, next);
};
