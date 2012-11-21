//topics  :topic_number is a number, local to current repository.
module.exports = function (server, models) {

//List topics by user v0.1.1 GET /users/:username/topics/
  server.get('/users/:username/topics', models.listTopicsByUser);
//List repo topics v0.1 GET /users/:username/repos/:repo_name/topics/
  server.get('/users/:username/repos/:repo_name/topics/', models.listTopicsByRepo);
//Create new topic v0.1 POST /users/:username/repos/:repo_name/topics/
  server.post('/users/:username/repos/:repo_name/topics/', models.createTopic);
//Get topic data v0.1 GET /users/:username/repos/:repo_name/topics/:topic_number
  server.get('/users/:username/repos/:repo_name/topics/:topic_number', models.getTopicData);
//Modify topic data v0.1 PUT /users/:username/repos/:repo_name/topics/:topic_number
  server.put('/users/:username/repos/:repo_name/topics/:topic_number', models.modifyTopic);
//Delete topic data v0.1 DELETE /users/:username/repos/:repo_name/topics/:topic_number
  server.del('/users/:username/repos/:repo_name/topics/:topic_number', models.deleteTopic);

return server
}
