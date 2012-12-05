var RecordNotFoundError = require('./errors').RecordNotFoundError;

module.exports = function(models, mongoose){

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var repositorySchema = new mongoose.Schema({
    initialCommit: String,
    userId: ObjectId,
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
  repositorySchema.index({ 'user_id': 1 });

  // Find the repositories that belong to the user
  repositorySchema.statics.findByUserId = function(userId, callback){
    this.find({ userId: userId }).exec(callback);
  };

  // Gets a repository by name for the user. Throws error if not found
  repositorySchema.statics.findOneByRepoName = function(userId, repoName, callback){
    this.findOne({ userId: userId, title: repoName }, function(err, data){
      if(err) return callback(err);
      if(data == null){
        return callback(new RecordNotFoundError());
      }
      callback(null, data);
    });
  };

  models.Repo = mongoose.model('Repo', repositorySchema);
  return models;
};

