var async = require('async')
  , autoIncrementPlugin = require('./plugins/autoIncrementPlugin')
  , RecordNotFoundError = require('./errors');

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

        // There isn't a simple way to do this in mongoose yet.
        // We'll come back to this.
       // models.User.findById(topic.repo.user, function(err, user) {
         // if(err) return callback(err);
          //topic.repo.user = user;
         // callback(null, topic);
        //});
        callback(null, topic);
      });
  };

  // Get the topics for a repository
  TopicSchema.statics.getByRepoName = function(repoName, callback) {
    var self = this;
    models.Repo.findOne({ title: repoName }, function(err, repo) {
      if(err) return callback(repoName);
      if(!repo) return callback(new RecordNotFoundError());

      self
        .find({ repo: repo._id })
        .populate('user')
        .populate('repo')
        .sort({ updatedAt: 'desc' })
        .exec(callback);
    });
  };

  // Add a post to this topic
  TopicSchema.methods.addPost = function(post, callback) {
    post.topic = this._id;
    post.topicNumber = this.number;
    post.createdAt = new Date();
    post.save(callback);
  };

  models.Topic = mongoose.model('Topic', TopicSchema);
  return models;
};

