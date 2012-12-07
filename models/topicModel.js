var autoIncrementPlugin = require('./plugins/autoIncrementPlugin');

module.exports = function(models, mongoose) {

  var ObjectId = mongoose.Schema.Types.ObjectId;

  TopicSchema = new mongoose.Schema({
    repoId: { type: ObjectId, required: true },
    userId: { type: ObjectId, required: true },
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

  TopicSchema.index({ 'repoId': 1 }, { 'userId': 1 });

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

