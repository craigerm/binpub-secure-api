var utils = require('../lib/utils')
  , RecordNotFoundError = require('../models/errors').RecordNotFoundError;

var allowedTopicKeys = {
  title: 1,
  body: 1
};

// GET /users/:userid/repos/:repoid/topics
module.exports.index = function(req, res, next){
  Topic.getByRepoName(req.params.repoid, function(err, topics) {
    return next(err, topics);
  });
};

// POST /users/:userid/repos/:repoid/topics
module.exports.create = function(req, res, next) {
  var fields = utils.slice(req.params, allowedTopicKeys);

  User.findOneByUsername(req.params.userid, function(err, user) {
    Repo.findOneByRepoName(user.id, req.params.repoid, function(err, repo) {
      if(err) return next(err);
      if(!repo) return next(new RecordNotFoundError());
      var topic = new Topic(fields);
      repo.addTopic(new Topic(fields), next);
    });
  });
};

// GET /users/:userid/repos/:repoid/topics/:topicid
module.exports.show = function(req, res, next) {
  Topic.findOne({number: req.params.topicid}, function(err, topic) {
    if(err) return next(err);
    if(!topic) return next(new RecordNotFoundError());
    return next(null, topic);
  });
};

// PUT /users/:userid/repos/:repoid/topics/:topicid
module.exports.update = function(req, res, next) {
  var updates = utils.slice(req.params, allowedTopicKeys);
  updates.updatedAt = new Date();
  Topic.findOneAndUpdate({number: req.params.topicid}, updates, next);
};

// DELETE /users/:userid/repos/:repoid/topics/:topicid
module.exports.destroy = function(req, res, next) {
  Topic.findOne({number: req.params.topicid}, function(err, topic) {
    if(err) return next(err);
    if(!topic) return next();
    topic.remove(function(err){
      next(err);       
    });
  });
};
