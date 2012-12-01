var restify = require('restify')
  , util = require('util');

// POST /v1/users/:username/sync_repos
module.exports.index = function(username, req, res, next){

  var client = restify.createJsonClient({
    url: 'https://api.github.com'
  });

  var getRepoPath = util.format('/users/%s/repos', username);

  client.get(getRepoPath, function(err, req, res, obj){
    if(err){
      return next(err);
    }
    console.log('Github returned %s objects', obj.length);
    Repo.syncGitHubData(obj, function(err){
      console.log('WHAT?');
      if(err)
        return next(err);
      return next();
    });
  });
};
