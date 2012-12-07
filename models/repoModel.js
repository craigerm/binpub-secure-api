var RecordNotFoundError = require('./errors').RecordNotFoundError;

module.exports = function(models, mongoose){

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var repositorySchema = new mongoose.Schema({
    initialCommit: String,
    user: { type: ObjectId, required: true, ref: 'User' }, // Reference to user. 
    githubId: Number,
    title: String,
    body: String,
    type: String,
    link: String,
    createdAt: Date,
    updatedAt: Date,
    uBlue: Number,
    dBlue: Number,
    uRed: Number,
    uGreen: Number,
    dGreen: Number
  }, { collection: 'repos' });

  // Add any indexes
  repositorySchema.index({ 'user': 1 });

  // Find the repositories that belong to the user
  repositorySchema.statics.findByUserId = function(userId, callback){
    this
      .find({ user: userId })
      .populate('user')
      .exec(callback);
  };

  // Gets a repository by name for the user. Throws error if not found
  repositorySchema.statics.findOneByRepoName = function(userId, repoName, callback){
    this
      .findOne({ user: userId, title: repoName })
      .populate('user')
      .exec(function(err, repo) {
        if(err) return callback(err);
        if(!repo) return callback(new RecordNotFoundError());
        callback(null, repo);
      });
  };

  // Add a topic to the repository
  repositorySchema.methods.addTopic = function(topic, callback) {
    var self = this;
    topic.repo = this._id;
    topic.user = this.user.id;
    topic.createdAt = new Date();
    topic.save(function(err, topic) {
      // Ther doesn't seem to be a better way to do this
      if(err) return callback(err); 

      // After we save the topic refetch it with the full ref docs
      // that the API needs. 
      self.db.model('Topic')
        .findById(topic._id)
        .populate('user')
        .populate('repo')
        .exec(function(err, topic) {
          self.db.model('User')
            .findById(topic.repo.user)
            .exec(function(err, user) {
              var jsonTopic = topic.toJSON();
              jsonTopic.repo.user = user;
              callback(err, jsonTopic);
            });
        });
    });
  };

  models.Repo = mongoose.model('Repo', repositorySchema);
  return models;
};

