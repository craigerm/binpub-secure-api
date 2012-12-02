// we need to load the user based on the username to get our internal user ID
// so we can fetch the repositories that way.

var dataHandler = function(next){
  return function(err, data){
    if(err) return next(err);
    return next(data);
  }
};

// GET /users/:username/repos (list user repos)
module.exports.index = function(username, req, res, next){
  User.findOneByUsername(username, function(err, user) {
    if(err) return next(err);
    Repo.findByUserId(user.id, function(err, repos){
      if(err) return next(err);
      return next(repos);
    });
  });
};

// GET /users/:username/repos/:reponame (get repo data)
module.exports.show = function(username, reponame, req, res, next){
  User.findOneByUsername(username, function(err, user) {
    if(err) return next(err);
    Repo.findOneByRepoName(user.id, reponame, dataHandler(next));
  });
};

// POST /users/:username/repos (sync repos with Github)
module.exports.create = function(username, req, res, next){  
  return next(new Error('Not implemented yet'));
};

