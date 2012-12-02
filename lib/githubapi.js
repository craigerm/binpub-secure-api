var restify = require('restify')
  , util = require('util');

var baseUrl = 'https://api.github.com';

// Our API just makes calls to the restify client
var client = restify.createJsonClient({
  url: baseUrl
});

// Our simple github API. We can try and use a 3rd party node package for this
// if needed, but our needs are pretty basic at this point.
var GitHubApi = {

  // Gets the GitHub repositories by the github username
  getReposByUser: function(username, callback) {
    var path = util.format('/users/%s/repos', username);
    client.get(path, function(err, req, res, obj) {
      if(err) {
        callback(err);
        return;
      }
      callback(null, obj);
    });
  }
};

module.exports = GitHubApi;
