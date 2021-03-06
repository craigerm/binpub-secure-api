var async = require('async')
  , autoIncrementPlugin = require('./plugins/autoIncrementPlugin')
  , RecordNotFoundError = require('./errors').RecordNotFoundError;

module.exports = function(models, mongoose) {

  var ObjectId = mongoose.Schema.Types.ObjectId;

  TopicSchema = new mongoose.Schema({
    repo: { type: ObjectId, required: true, ref: 'Repo' },
    user: { type: ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, required: true },
	  updatedAt: Date,
    //
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
  }, { collection: 'topics' });

  TopicSchema.index({ 'repo': 1 }, { 'user': 1 });

  // Make the number field auto-incrementable
  TopicSchema.plugin(autoIncrementPlugin.plugin, {field: 'number'});

  // Get the topic 
  TopicSchema.statics.getByNumber = function(number, callback) {
    this
      .findOne({ number: number })
      .populate('user')
      .populate('repo')
      .exec(function(err, topic) {
        if(err) return callback(err);
        if(!topic) return callback(new RecordNotFoundError());

        // Not sure what the best approach is here. Ideally mongo would support
        // .populate('repo.user') for ref types and not just sub-docs.
        models.User
          .findById(topic.repo.user)
          .exec(function(err, user) {
            var json = topic.toJSON();
            json.repo.user = user;
            callback(err, json);
          });
      });
  };

  // Get the topics for a repository
  // TODO: This is pretty ugly. We probably should optimize our data model for
  // these types of queries.
  TopicSchema.statics.getByRepoName = function(username, repoName, callback) {
    var self = this;
    self.db.model('User').findOne({ username: username }, function(err, user) {
      if(err) return callback(err);
      if(!user) return callback(new RecordNotFoundError());

      self.db.model('Repo').findOne({ user: user._id, title: repoName }, function(err, repo) {
        if(err) return callback(repoName);
        if(!repo) return callback(new RecordNotFoundError());

        var jsonTopics = [];

        self.db.model('Topic')
          .find({ repo: repo._id })
          .populate('user')
          .populate('repo')
          .sort({ updatedAt: 'desc' })
          .exec(function(err, topics) {
            if(err) return callback(err);
            async.forEach(topics, function(topic, cb) {
              self.db.model('User')
                .findById(topic.repo.user)
                .exec(function(err, user) {
                  var json = topic.toJSON();
                  json.repo.user = user;
                  jsonTopics.push(json);
                  cb(err);
                });
            },
            function(err) {
              if(err) return callback(err);
              callback(null, jsonTopics);
            });
          });
      });
    });
  };

  // Add a post to this topic
  TopicSchema.methods.addPost = function(post, callback) {
    var self = this;
    post.topic = this._id;
    post.topicNumber = this.number;
    post.createdAt = new Date();
    post.save(function(err, post) {
      if(err) return callback(err);
      self.db.model('Post').getByNumber(post.number, callback);
    });
  };

  models.Topic = mongoose.model('Topic', TopicSchema);
  return models;
};

