module.exports.index = function(username, req, res, next){
  var repos = [
    { name: 'binpub', id: 1 },
    { name: 'twitter-api', id: 2 }
  ];
  return next(repos);
};
module.exports.show = function(username, repoid, req, res, next){
  var data = {name: repoid, owner: username, id: 1000};
  return next(data);
};

// POST /v1/users/:id/repos/:id
module.exports.create = function(req, res, next){
  return next();
};
module.exports.update = function(req, res, next){
  return next();
};
