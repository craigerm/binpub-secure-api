var GitHubApi = require('../lib/githubapi');

// POST /v1/users/:username/sync_repos
module.exports.create = function(username, req, res, next){
  var userId = 1; // need to fix this
  GitHubApi.getReposByUser(username, function(err, data) {
    if(err) {
      return next(err);
    }
    Repo.syncGitHubData(userId, data, next);
  });
};

