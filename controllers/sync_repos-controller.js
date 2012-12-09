var GitHubApi = require('../lib/githubapi')
  , security = require('../auth/security');

module.exports.before = [
  { method: security.authenticate, only: ['create'] },
  { method: security.checkPermission, only: ['create'] }
];

// POST /v1/users/:username/sync_repos
module.exports.create = function(req, res, next) {
  User.findOneByUsername(req.params.userid, function(err, user) {
    if(err) return next(err);

    GitHubApi.getReposByUser(req.params.userid, function(err, data) {
      if(err) return next(err);
      user.syncGitHubData(data, next);
    });
  });
};

