// we need to load the user based on the username to get our internal user ID
// so we can fetch the repositories that way.

var dataHandler = function(next){
  return function(err, data){
    if(err) return next(err);
    return next(data);
  }
};

// GET /v1/users/:username/repos (list user repos)
module.exports.index = function(username, req, res, next){
  var userId = 1; // TEMP
  Repo.findByUserId(userId, function(err, repos){
    if(err) return next(err);
    return next(repos);
  });
};

// GET /v1/users/:username/repos/:reponame (get repo data)
module.exports.show = function(username, reponame, req, res, next){
  var userId = 1;// temp
  Repo.findOneByRepoName(userId, reponame, dataHandler(next));
};

// POST /v1/users/:id/repos (sync repos with Github)
module.exports.create = function(req, res, next){
  return next();
};

