//commit model
module.exports = function(models, mongoose) {
  var Commit, CommitSchema, color, validate_url;
  CommitSchema = new mongoose.Schema({
	  sha: String,
      user: Number,
      title: String,
      body: String,
	  type: String,
	  link: String,
      date: Number,
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number

  }, {collection: 'commits'});
  
  CommitSchema.index({'sha': 1}, {'repo_id':1}, {'user_id': 1});

  mongoose.model('Commit', CommitSchema);
  models.Commit = mongoose.model('Commit');
  
  models.listCommitsByUser = function listCommitsByUser(req, res, next){
    console.log('listCommitsByUser');
    models.Commit.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('found commits');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.listCommitsByRepo = function getCommitsByRepo(req, res, next){
    console.log('listCommitsByRepo');
    models.Commit.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding commits');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.getCommitData = function getCommitData(req, res, next){
    console.log('get Commit Data');
    models.Commit.find({ sha: req.params.sha})
				.execFind(function (arr,data) {
                  console.log('foundCommit: '+req.param.sha);
	              console.log(arr);
	              console.log(data);
                  res.send(data);
                });

  }; 
    models.deleteCommit = function deleteCommit(req, res, next){
    console.log('deleteCommit');
	res.send({ CommitDelete: 'not implemented'});
  }; 
  
  
  color = function() {
  
  
  };
  
  validate_url = function() {
  
  };
  
  return models
};