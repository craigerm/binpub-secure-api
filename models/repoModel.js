//repository model
module.exports = function(models, mongoose) {
  var Repository, RepositorySchema, color, validate_url;
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
	{ collection, 'repos'});
	
  RepositorySchema.index({'user_id': 1});

  mongoose.model('Repository', RepositorySchema);
  models.Repository = mongoose.model('Repository');
  
  models.listReposByUser = function listReposByUser(req, res, next){
    console.log('listReposByUser');
    models.Topics.find().limit(20).sort('date', -1).execFind(function (arr,data) {
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
    console.log('modifyUser');
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