var RecordNotFoundError = require('./errors').RecordNotFoundError;

module.exports = function(models, mongoose){

  var repositorySchema = new mongoose.Schema({
    initialCommit: String,
    userId: Number,
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
    this
      .find({ userId: userId })
      .exec(callback);
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

  // I think it might be best to split the schema and business logic methods
  // into seperate files
  repositorySchema.statics.insertGitHubData = function(userId, data, callback) {

    // Currently we only insert the data
    var itemsSaved = 0;

    for(var i=0; i < data.length; i++){
      var item = data[i];
      var repo = new this();
      repo.userId = userId;
      repo.repoId = item.id;
      repo.title = item.name;
      repo.link = item.html_url;
      repo.createdAt = item.created_at;
      repo.updatedAt = item.updated_at;      

      // No bulk insert for mongoose yet so we wait until 
      // all items are saved and then we execute the callback handler
      repo.save(function(err){
        if(err) return callback(err);
        if(++itemsSaved == data.length){
          callback();
        }
      });
    };
  };

  // This will create, delete or update the github data in our system to the
  // current github state.
  repositorySchema.statics.syncGitHubData = function(userId, data, callback){
    var self = this;
    // First delete all repositories for this user and then inserts them again.
    self 
      .where('userId')
      .equals(userId)
      .remove(function(err) {
        if(err) return callback(err);
        self.insertGitHubData(userId, data, callback);
      });
  };

  mongoose.model('Repo', repositorySchema);
  models.Repo = mongoose.model('Repo');

  return models;
};

//repository model
var temp = function(models, mongoose) {
  var Repo, RepositorySchema, color, validate_url;
  RepositorySchema = new mongoose.Schema({
	  initialCommit: String,
      user_id: Number,
	  github_id: Number,
      title: String,
      body: String,
	  type: String,
	  link: String,
      createdAt: Number,
	  updatedAt: Number,
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
    },
	{ collection: 'repos'});
	
  RepositorySchema.index({'user_id': 1});

  mongoose.model('Repo', RepositorySchema);
  models.Repo = mongoose.model('Repo');
  
  models.listReposByUser = function listReposByUser(req, res, next){
    console.log('listReposByUser');
    models.Repo.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.syncRepo = function syncRepo(req, res, next){
    console.log('syncRepo');
  };
  models.getRepoData = function getRepoData(req, res, next){
    console.log('getRepoData');
    models.Repo.find({ repo_id: req.params.repo_name})
				.execFind(function (arr,data) {
                  console.log('foundRepo: '+req.param.repo_name);
	              console.log(arr);
	              console.log(data);
                  res.send(data);
                });

  }; 
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  validate_unique_title = function () {
  
  };
  
  return models
};
