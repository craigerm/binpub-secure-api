// GET /users/:username/repos (list user repos)
module.exports.index = function(username, req, res, next){
  User.findOneByUsername(username, function(err, user) {
    if(err) return next(err);
    Repo.findByUserId(user.id, next);
  });
};

// GET /users/:username/repos/:reponame (get repo data)
module.exports.show = function(username, reponame, req, res, next){
  User.findOneByUsername(username, function(err, user) {
    Repo.findOneByRepoName(user.id, reponame, next);
  });
};

// POST /users/:username/repos (sync repos with Github)
module.exports.create = function(username, req, res, next){  
  return next(new Error('Not implemented yet'));
};

