// GET /users/:userid/repos/:repoid/topics
module.exports.index = function(username, repoid, req, res, next){
  next();
};

// POST /users/:userid/repos/:repoid/topics
module.exports.create = function(username, repoid, req, res, next) {
  next();
};

// GET /users/:userid/repos/:repoid/topics/:topicid
module.exports.show = function(username, repoid, topicid, req, res, next) {
  next();
};

// PUT /users/:userid/repos/:repoid/topics/:topicid
module.exports.update = function(username, repoid, topicid, req, res, next) {
  next();
};

// DELETE /users/:userid/repos/:repoid/topics/:topicid
module.exports.destroy = function(username, repoid, topic, req, res, next) {
  next();
};
