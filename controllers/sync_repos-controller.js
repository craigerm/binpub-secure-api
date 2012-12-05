var GitHubApi = require('../lib/githubapi');

// POST /v1/users/:username/sync_repos
module.exports.create = function(username, req, res, next) {
  User.findOneByUsername(username, function(err, user) {
    if(err) throw err; 

    GitHubApi.getReposByUser(username, function(err, data) {
      if(err) throw err; 
      user.syncGitHubData(data, next);
    });
  });
};

