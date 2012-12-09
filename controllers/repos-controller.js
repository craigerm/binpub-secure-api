var security = require('../auth/security');

exports.before = [
  { method: security.authenticate, except: ['index','show'] }
];

// GET /users/:username/repos (list user repos)
module.exports.index = function(req, res, next){
  User.findOneByUsername(req.params.userid, function(err, user) {
    if(err) return next(err);
    Repo.findByUserId(user.id, next);
  });
};

// GET /users/:username/repos/:reponame (get repo data)
module.exports.show = function(req, res, next){
  User.findOneByUsername(req.params.userid, function(err, user) {
    Repo.findOneByRepoName(user.id, req.params.repoid, next);
  });
};

