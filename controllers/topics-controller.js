var utils = require('../lib/utils')
  , async = require('async')
  , security = require('../auth/security')
  , Errors = require('../models/errors')
  , RecordNotFoundError = Errors.RecordNotFoundError
  , NotAuthorizedError = Errors.NotAuthorizedError;

module.exports.before = [
  { method: security.authenticate, except: ['index','show'] },
  { method: loadTopic, except: ['index','create'] },
  { method: checkPermission, only: ['update', 'destroy'] }
];

var topic = null;

// Loads the topic based on the :topicid param
function loadTopic(req, res, next) {
  Topic.getByNumber(req.params.topicid, function(err, fetchedTopic) {
    if(err) return next(err);
    topic = fetchedTopic;
    next();
  });
};

// Makes sure the the current user is the owner of the topic
// TODO: Expand this to allow repo owners and admins.
function checkPermission(req, res, next) {
  if(topic.user._id == req.userProfile.id) {
    return next();
  }
  return next(new NotAuthorizedError());
};

var allowedTopicKeys = {
  title: 1,
  body: 1
};

// GET /users/:userid/repos/:repoid/topics
module.exports.index = function(req, res, next){
  Topic.getByRepoName(req.params.userid, req.params.repoid, next);
};

// POST /users/:userid/repos/:repoid/topics
module.exports.create = function(req, res, next) {
  var fields = utils.slice(req.params, allowedTopicKeys);
  User.findOne({ username: req.params.userid }, function(err, user) {
    if(err) return next(new RecordNotFoundError());
    Repo.findOneByRepoName(user._id, req.params.repoid, function(err, repo) {
      if(err) return next(err);
      var topic = new Topic(fields);
      topic.user = req.userProfile.id;
      repo.addTopic(topic, next);
    });
  });
};

// GET /users/:userid/repos/:repoid/topics/:topicid
module.exports.show = function(req, res, next) {
  Topic.getByNumber(req.params.topicid, next);
};

// PUT /users/:userid/repos/:repoid/topics/:topicid
module.exports.update = function(req, res, next) {
  var updates = utils.slice(req.params, allowedTopicKeys);
  updates.updatedAt = new Date();
  Topic.update({ number: topic.number}, updates, next);
};

// DELETE /users/:userid/repos/:repoid/topics/:topicid
module.exports.destroy = function(req, res, next) {
  Topic.remove({ number: topic.number }, function(err) {
    if(err) return next(err);
    Post.remove({ topicNumber: topic.number }, next);
  });
};
