var Errors = require('../models/errors')
  , RecordNotFoundError = Errors.RecordNotFoundError
  , NotAuthorizedError = Errors.NotAuthorizedError
  , session = require('../auth/session')
  , security = require('../auth/security')
  , utils = require('../lib/utils');

module.exports.before = [
  { method: security.authenticate, except: ['index','show'] },
  { method: loadPost, except: ['index','create'] },
  { method: checkPermission, only: ['update','destroy'] }
];

var allowedKeys = {
  text: 1
};

var post = null;

function loadPost(req, res, next) {
  Post.getByNumber(req.params.postid, function(err, fetchedPost) {
    if(err) return next(err);
    post = fetchedPost;
    next();
  });
}

function checkPermission(req, res, next) {
  if(post.user._id == req.userProfile.id) {
    return next();
  }
  next(new NotAuthorizedError());
}

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
  Post.updateByNumber(post.number, update, next);
};

// DELETE ../topics/:topicid/posts/:postid
module.exports.destroy = function(req, res, next) {
  Post.remove({ number: req.params.postid }, next);
};
