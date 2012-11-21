// :username is a user name user has on GitHub.
module.exports = function(server, models) {
// Get user data v0.1 GET /users/:username
  server.get('/user/:username', models.getUser);
// Modify user data v0.1 PUT /users/:username
  server.put('user/:username', models.modifyUser);
// Delete user v0.1 DELETE /users/:username
  server.del('user/:username', models.deleteUser);
return server
}