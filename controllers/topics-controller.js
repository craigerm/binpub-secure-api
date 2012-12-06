var utils = require('../lib/utils')
  , RecordNotFoundError = require('../models/errors').RecordNotFoundError;

var allowedTopicKeys = {
  title: 1,
  body: 1,
  type: 1,
  uBlue: 1,
  dBlue: 1,
  uRed: 1,
  dRed: 1,
  uGreen: 1,
  dGreen: 1
};

// GET /users/:userid/repos/:repoid/topics
module.exports.index = function(req, res, next){
  console.log('Gettin repos by %', req.params.repoid);
  Topic.getByRepoName(req.params.repoid, function(err, topics) {
    return next(err, topics);
  });
};

// POST /users/:userid/repos/:repoid/topics
module.exports.create = function(req, res, next) {
  var fields = utils.slice(req.params, allowedTopicKeys);

  User.findOneByUsername(req.params.userid, function(err, user) {
    Repo.findOneByRepoName(user.id, req.params.repoid, function(err, repo) {
      var topic = new Topic(fields);
      topic.repoId = repo._id
      topic.userId = user._id;
      topic.number = 99;
      topic.save(next);
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
  next();
};

// DELETE /users/:userid/repos/:repoid/topics/:topicid
module.exports.destroy = function(req, res, next) {
  console.log('HHERE WITRH %s', req.params.topicid);
  Topic.findOne({number: req.params.topicid}, function(err, topic) {
    if(err) return next(err);
    if(!topic) return next();
    topic.remove(function(err){
      console.log('DELETE');
      console.log('ERR %', err);
      next(err);       
    });
  });
};
