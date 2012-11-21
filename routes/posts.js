//posts
module.exports = function (server, models) {

//list user post v0.1.1 GET /users/:username/posts/
  server.get('/users/:username/posts/', models.listPostsByUser);
//list topics post v0.1 GET /users/:username/repos/:repo_name/topics/:topic_number/posts/
  server.get('/users/:username/repos/:repo_name/topics/:topic_number/posts/', models.listPostsByParent);
//create new post v0.1 POST /users/:username/repos/:repo_name/topics/:topic_number/posts/
  server.post('/users/:username/repos/:repo_name/topics/:topic_number/posts/', models.createPost);
//get post data v0.1 GET /users/:username/repos/:repo_name/topics/:topic_number/posts/:id
  server.get('/users/:username/repos/:repo_name/topics/:topic_number/posts/:id', models.getPostData);
//modify posts v0.1 PUT /users/:username/repos/:repo_name/topics/:topic_number/posts/:id
  server.put('/users/:username/repos/:repo_name/topics/:topic_number/posts/:id', models.modifyPost);
// delete posts v0.1 DELETE /users/:username/repos/:repo_name/topics/:topic_number/posts/:id
  server.del('/users/:username/repos/:repo_name/topics/:topic_number/posts/:id', models.deletePost);

return server
}