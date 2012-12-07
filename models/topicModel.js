var autoIncrementPlugin = require('./plugins/autoIncrementPlugin');

module.exports = function(models, mongoose) {

  var ObjectId = mongoose.Schema.Types.ObjectId;

  TopicSchema = new mongoose.Schema({
	  repoId: ObjectId,
    userId: ObjectId,
    title: String,
	  number: Number,
    body: String,
	  type: String,
    createdAt: Date,
	  updatedAt: Date,
    //
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
  }, { collection: 'topics' });

  TopicSchema.index({ 'number' : 1 }, { 'repo_id': 1 }, { 'user_id': 1 });

  // Make the number field auto-incrementable
  TopicSchema.plugin(autoIncrementPlugin.plugin, {field: 'number'});

  // Get the topics for a repository
  TopicSchema.statics.getByRepoName = function(repoName, callback) {
    var self = this;
    models.Repo.findOne({title: repoName}, function(err, repo) {
      if(err) return callback(err);
      self.find({repoId: repo.id})
        .sort({ updatedAt: 'desc' })
        .exec(callback);
    });
  };

  // Add a post to this topic
  TopicSchema.methods.addPost = function(post, callback) {
    post.topicId = this._id;
    post.topicNumber = this.number;
    post.createdAt = new Date();
    post.save(callback);
  };

  models.Topic = mongoose.model('Topic', TopicSchema);
  return models;
};

