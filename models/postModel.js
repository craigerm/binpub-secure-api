var RecordNotFoundError = require('./errors').RecordNotFoundError
  , async = require('async')
  , autoIncrementPlugin = require('./plugins/autoIncrementPlugin');

module.exports = function(models, mongoose) {
  var ObjectId = mongoose.Schema.Types.ObjectId;

  var PostSchema = new mongoose.Schema({
    topic: { type: ObjectId, required: true, ref: 'Topic' },
    number: { type: Number, unique: true },
    user: { type: ObjectId, required: true, ref: 'User' },
    topicNumber: { type: Number, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: Date
  }, { collection: 'posts' });

  PostSchema.index({'user': 1}, {'number': 1}, {'topic': 1}, {'topicNumber': 1});

  PostSchema.plugin(autoIncrementPlugin.plugin, {field: 'number'});

  // This will get a post that belongs to the user. This is used for updating
  // or deletion.
  PostSchema.statics.findOneForUser = function(postNumber, ownerId, callback) {
    this.findOne({ number: postNumber }, function(err, post) {
      if(err) return callback(err);

      if(post && post.user == ownerId) {
        return callback(null, post);
      }
      return callback(new RecordNotFoundError());
    });
  };

  PostSchema.statics.updateUsersPost = function(userId, postId, update, callback) {
    this
      .findOneForUser(postId, userId)
      .exec(function(err, post) {
        if(err) return callback(err);
        update.updatedAt = new Date();
        post.update(update, function(err, post) {
          self.getByNumber(post.number, callback);         
        });
      });
  };

  PostSchema.statics.getByTopicNumber = function(topicNumber, callback) { 
    var self = this;
    var jsonPosts = [];
    self
      .find({ topicNumber: topicNumber })
      .populate('user')
      .sort({ createdAt: 'asc' })
      .exec(function(err, posts) {
        if(err) return callback(err);
        async.forEach(posts, function(post, cb) {
          self.db.model('Topic')
            .getByNumber(post.topicNumber, function(err, topic) {
              if(err) return cb(err);
              var json = post.toJSON();
              json.topic = topic 
              jsonPosts.push(json);
              cb();
            });
        }, function(err) {
          callback(err, jsonPosts);
        });
      });
  };

  PostSchema.statics.getByNumber = function(postNumber, callback ) {
    this.getByFilter({ number: postNumber }, callback);
  };

  PostSchema.statics.getByFilter = function(query, callback) {
    var self = this;
    self.findOne(query)
      .populate('topic')
      .populate('user')
      .exec(function(err, post) {
        if(err) return callback(err);
        if(!post) return callback(new RecordNotFoundError());
        self.db.model('Repo')
          .findById(post.topic.repo)
          .populate('user')
          .exec(function(err, repo) {
            var json = post.toJSON();
            json.topic.repo = repo;
            callback(err, json);
          });
      });
  };

  models.Post = mongoose.model('Post', PostSchema);
  return models; 
};

