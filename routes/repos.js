//repos :repo_name is a repository name it has on GitHub.
module.exports = function (server, models) {
// List user repos v0.1 GET /users/:username/repos/
  server.get('/users/:username/repos/', models.listReposByUser);
// Syn Repos with Github v0.1 POST /users/:username/repos/
  server.post('/users/:username/repos/', models.syncRepo);
// Get Repo data v0.1 GET /users/:username/repos/:repo_name
  server.get('/users/:username/repos/', models.getRepoData);

return server
}