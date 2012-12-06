module.exports = function(models, mongoose) {

  var ObjectId = mongoose.Schema.Types.ObjectId;

  TopicSchema = new mongoose.Schema({
	  repoId: ObjectId,
    userId: ObjectId,
    title: String,
	  number: Number,
    body: String,
	  type: String,
    createdAt: Number,
	  updatedAt: Number,
    //
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
  }, { collection: 'topics' });

  TopicSchema.index({ 'number' : 1 }, { 'repo_id': 1 }, { 'user_id': 1 });

  // Get the topics for a repository
  TopicSchema.statics.getByRepoName = function(repoName, callback) {
    var self = this;
    models.Repo.findOne({title: repoName}, function(err, repo) {
      if(err) return callback(err);
      self.find({repoId: repo.id})
        .sort('updatedAt', -1)
        .exec(callback);
    });
  };

  models.Topic = mongoose.model('Topic', TopicSchema);
  return models;
};

//Topic model 
var temp = function(models, mongoose) {
  console.log('entering Topic model');
  var Topic, TopicSchema, validate_url;
  TopicSchema = new mongoose.Schema({
	  repo_id: Number,
    user_id: String,
    title: String,
	  number: Number,
    createdAt: Number,
	  updatedAt: Number,
//
	  uBlue: Number,
	  dBlue: Number,
	  uRed: Number,
	  dRed: Number,
	  uGreen: Number,
	  dGreen: Number
  }, 
  {collection: 'topics'});
  
  TopicSchema.index({'number': 1}, {'repo_id':1}, {'user_id': 1});

  mongoose.model('Topic', TopicSchema);
  models.Topic = mongoose.model('Topic');
  
  models.listTopicsByUser = function listTopicsByUser(req, res, next){
    console.log('listTopicsByUser');
    models.Topic.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.listTopicsByRepo = function getTopicsByRepo(req, res, next){
    console.log('listTopicsRepo');
    models.Topic.find().limit(20).sort('date', -1).execFind(function (arr,data) {
      console.log('finding');
	  console.log(arr);
	  console.log(data);
      res.send(data);
    });
  };
  models.getTopicData = function getTopicData(req, res, next){
    console.log('getTopicsData');
    models.Topic.find({ repo_id: req.params.repo_name})
	            .where('number').equals(req.params.topic_number)
				.execFind(function (arr,data) {
                  console.log('foundTopic: '+req.param.topic_number);
	              console.log(arr);
	              console.log(data);
                  res.send(data);
                });

  };
  models.modifyTopic = function modifyTopic(req, res, next){
    console.log('modify topic')
  };
  models.deleteTopic = function deleteTopic(req, res, next){
    console.log('deleteTopic');
	res.send({ topicDelete: 'not implemented'});
  };
  models.createTopic = function createTopic(req, res, next){
    console.log('createTopic');
 };  
  
  validate_url = function() {
  
  };
  
  return models
};
