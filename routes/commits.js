//commits
module.exports = function (server, models) {
//list repo commits v0.1.1 GET /users/:username/repos/:repo_name/commits/
  server.get('/users/:username/repos/:repo_name/commits/', models.listCommitsByRepo);
//list user commits v0.1.1 GET /users/:username/commits
  server.get('/users/:username/commits', models.listCommitsByUser);
//get commmit data v0.1.1 GET /commit/:sha
  server.get('/commit/:sha', models.getCommitData);
  
return server
}