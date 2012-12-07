var RecordNotFoundError = require('../models/errors').RecordNotFoundError
  , session = require('../auth/session')
  , utils = require('../lib/utils');

var allowedKeys = {
  text: 1
};

// GET ../topics/:topicid/posts
module.exports.index = function(req, res, next) {
  Post.getByTopicNumber(req.params.topicid, next);
};

// POST ../topics/:topicid/posts
module.exports.create = function(req, res, next) {

  Topic.findOne({number: req.params.topicid}, function(err, topic) {
    if(err) return next(err);
    if(!topic) return next(new RecordNotFoundError());
    var fields = utils.slice(req.params, allowedKeys);
    var post = new Post(fields);
    post.user = req.userProfile.id;
    topic.addPost(post, next);
  });
};

// GET ../topics/:topicid/posts/:postid
module.exports.show = function(req, res, next) {
  Post.getByNumber(req.params.postid, next);
};

// PUT ../topics/:topicid/posts/:postid
module.exports.update = function(req, res, next) {
  var update= utils.slice(req.params, allowedKeys);
  Post.updateUsersPost(req.userProfile.id, req.params.postid, update, next);
};

// DELETE ../topics/:topicid/posts/:postid
module.exports.destroy = function(req, res, next) {
  Post.findOneForUser(req.params.postid, req.userProfile.id, function(err, post) {
    if(err) return next(err);
    post.remove(next);
  });
};
