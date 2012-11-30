// GET /v1/users/:username/repos (list user repos)
module.exports.index = function(username, req, res, next){
  var repos = [
    { name: 'binpub', id: 1, owner: username },
    { name: 'twitter-api', id: 2, owner: username }
  ];
  return next(repos);
};

// GET /v1/users/:username/repos/:reponame (get repo data)
module.exports.show = function(username, reponame, req, res, next){
  var data = {name: reponame, owner: username, id: 1000};
  return next(data);
};

// POST /v1/users/:id/repos (sync repos with Github)
module.exports.create = function(req, res, next){
  return next();
};

